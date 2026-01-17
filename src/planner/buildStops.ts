type RequirementStatus = "HAS" | "MISSING" | "UNKNOWN";

export type RouteInput = {
  tramiteId: string;
  requirementsStatus: Record<string, RequirementStatus>;
};

type Catalog = {
  tramites: Array<{
    id: string;
    name: string;
    destinationCategory: string;
    required: string[];
    optional?: string[];
  }>;
  requirementsDictionary: Record<
    string,
    {
      name: string;
      stopCategory: string | null;
    }
  >;
  providersCatalog: Record<
    string,
    Array<{
      id?: string;
      name: string;
      address: string;
      lat: number | null;
      lng: number | null;
      city?: string | null;
    }>
  >;
};

export type Stop = {
  kind: "PREREQ_STOP" | "FINAL_DESTINATION";
  category: string;
  requirementId?: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  reason: string;
};

export type ChecklistItem = {
  requirementId: string;
  name: string;
  status: RequirementStatus;
  stopCategory?: string | null;
};

export function buildStopsFromCatalogAndChat(
  catalog: Catalog,
  input: RouteInput
): { tramiteName: string; stops: Stop[]; checklist: ChecklistItem[] } {
  const tramite = catalog.tramites.find((t) => t.id === input.tramiteId);
  if (!tramite) throw new Error(`Tramite no encontrado: ${input.tramiteId}`);

  const dict = catalog.requirementsDictionary;
  const providers = catalog.providersCatalog;

  const requiredReqs = Array.isArray(tramite.required) ? tramite.required : [];
  const optionalReqs = Array.isArray(tramite.optional) ? tramite.optional : [];
  const allReqs = [...requiredReqs, ...optionalReqs];

  const physicalStopCategories = new Set(["pago", "copias"]);

  const prereqStops: Stop[] = [];
  const checklist: ChecklistItem[] = [];

  for (const reqId of allReqs) {
    const reqMeta = dict[reqId];
    const status = input.requirementsStatus?.[reqId] ?? "UNKNOWN";

    if (!reqMeta) {
      checklist.push({ requirementId: reqId, name: reqId, status });
      continue;
    }

    const stopCategory = reqMeta.stopCategory ?? null;

    // Crear parada solo si es MISSING y es fisico (pago/copias)
    if (status === "MISSING" && stopCategory && physicalStopCategories.has(stopCategory)) {
      const providerList = providers[stopCategory] || [];
      const chosen = providerList[0] || null;

      prereqStops.push({
        kind: "PREREQ_STOP",
        category: stopCategory,
        requirementId: reqId,
        name: chosen ? chosen.name : `Parada (${stopCategory})`,
        address: chosen ? chosen.address : "Por definir",
        lat: chosen ? chosen.lat : null,
        lng: chosen ? chosen.lng : null,
        reason: `Falta: ${reqMeta.name}`
      });

      continue;
    }

    // Checklist: todo lo que no esta "HAS"
    if (status !== "HAS") {
      checklist.push({
        requirementId: reqId,
        name: reqMeta.name,
        status,
        stopCategory
      });
    }
  }

  // Destino final
  const finals = providers[tramite.destinationCategory] || [];
  const finalChosen = finals[0] || null;

  const finalStop: Stop = {
    kind: "FINAL_DESTINATION",
    category: tramite.destinationCategory,
    name: finalChosen ? finalChosen.name : `Destino (${tramite.destinationCategory})`,
    address: finalChosen ? finalChosen.address : "Por definir",
    lat: finalChosen ? finalChosen.lat : null,
    lng: finalChosen ? finalChosen.lng : null,
    reason: "Destino del tramite"
  };

  return {
    tramiteName: tramite.name,
    stops: [...prereqStops, finalStop],
    checklist
  };
}
