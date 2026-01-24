import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { tramitesService } from '../../services/tramitesService';
import { EstadoTramite } from '../../components/EstadoTramite';
import { ConsejosTips } from '../../components/ConsejosTips';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Tramites'>;
};

export function TramitesListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const tramites = tramitesService.getTodos();

  // Categorías disponibles
  const categories = [
    { id: 'identidad', label: 'Identidad', icon: '🆔' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'legal', label: 'Legal', icon: '⚖️' },
    { id: 'tributario', label: 'Tributario', icon: '💼' },
    { id: 'vehicular', label: 'Vehicular', icon: '🚗' },
    { id: 'educativo', label: 'Educativo', icon: '📚' },
  ];

  // Filtrar trámites
  const filteredTramites = useMemo(() => {
    return tramites.filter(tramite => {
      const matchesSearch =
        tramite.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        tramite.descripcion.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = !selectedCategory || tramite.categoria === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  // Agrupar por categoría
  const groupedTramites = useMemo(() => {
    const grouped: Record<string, typeof tramites> = {};
    filteredTramites.forEach(tramite => {
      if (!grouped[tramite.categoria]) {
        grouped[tramite.categoria] = [];
      }
      grouped[tramite.categoria].push(tramite);
    });
    return grouped;
  }, [filteredTramites]);

  const handleTramitePress = (tramiteId: string) => {
    navigation.navigate('TramiteFlow', {
      tramiteId,
      version: 'advanced',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trámites disponibles</Text>
        <Text style={styles.subtitle}>
          {filteredTramites.length} trámite{filteredTramites.length !== 1 ? 's' : ''} encontrado{filteredTramites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Consejos */}
        <ConsejosTips
          type="info"
          title="💡 Búsqueda de trámites"
          consejos={[
            'Filtra por categoría para encontrar más rápido',
            'Usa la búsqueda para trámites específicos',
            'Haz clic en cualquier trámite para comenzar',
          ]}
        />

        {/* Búsqueda */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>🔍 Buscar trámite</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Ej: pasaporte, licencia, RUC..."
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Categorías */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesLabel}>Categorías</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                !selectedCategory && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.categoryButtonText}>Todos</Text>
            </TouchableOpacity>

            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryButtonIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === cat.id && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Resultados */}
        {filteredTramites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No hay resultados</Text>
            <Text style={styles.emptyStateText}>
              No encontramos trámites que coincidan con tu búsqueda
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                setSearchText('');
                setSelectedCategory(null);
              }}
            >
              <Text style={styles.emptyStateButtonText}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tramitesContainer}>
            {Object.entries(groupedTramites).map(([categoryId, categoryTramites]) => {
              const categoryName = categories.find(c => c.id === categoryId)?.label || categoryId;
              const categoryIcon = categories.find(c => c.id === categoryId)?.icon || '📋';

              return (
                <View key={categoryId} style={styles.categorySection}>
                  <Text style={styles.categorySectionTitle}>
                    {categoryIcon} {categoryName}
                  </Text>
                  <View style={styles.categoryTramites}>
                    {categoryTramites.map(tramite => (
                      <TouchableOpacity
                        key={tramite.id}
                        style={styles.tramiteCard}
                        onPress={() => handleTramitePress(tramite.id)}
                        activeOpacity={0.7}
                      >
                        <EstadoTramite
                          tramite={tramite}
                          pasoActual={1}
                          totalPasos={4}
                          onPress={() => handleTramitePress(tramite.id)}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Información adicional */}
        <ConsejosTips
          type="success"
          title="✨ Cada paso te guiará"
          consejos={[
            'Información: Entiende los requisitos del trámite',
            'Requisitos: Verifica tus documentos',
            'Pago: Confirma los costos',
            'Seguimiento: Recibe actualizaciones',
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f0f9ff',
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 14,
    color: '#1f2937',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoriesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  categoriesList: {
    paddingRight: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#0284c7',
  },
  categoryButtonIcon: {
    fontSize: 14,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  tramitesContainer: {
    paddingHorizontal: 12,
  },
  categorySection: {
    marginBottom: 20,
  },
  categorySectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  categoryTramites: {
    gap: 10,
  },
  tramiteCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
