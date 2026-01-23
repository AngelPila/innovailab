import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "./firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user; // 🔑 el usuario autenticado
  } catch (error) {
    console.error("Error al iniciar sesión con Google", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión", error);
    throw error;
  }
};
