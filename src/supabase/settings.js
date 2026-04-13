import { createClient } from '../utils/supabase/client';
const supabase = createClient();

export const getSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.warn("La tabla 'settings' no se encuentra, usando valores por defecto.");
    return null;
  }
  return data;
};

export const updateSettings = async (settings) => {
  // Intentamos obtener la fila de settings existente
  const { data: existing, error: fetchError } = await supabase
    .from('settings')
    .select('id')
    .maybeSingle(); // maybeSingle no da error si no hay resultados
  
  if (existing) {
    // Si existe, actualizamos ESA fila
    const { data, error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', existing.id)
      .select();
    if (error) throw error;
    return data[0];
  } else {
    // Si NO existe, insertamos como primera fila
    const { data, error } = await supabase
      .from('settings')
      .insert([settings])
      .select();
    if (error) throw error;
    return data[0];
  }
};
