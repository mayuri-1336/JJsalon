import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wgbeqmelhsunntumbxee.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmVxbWVsaHN1bm50dW1ieGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzMxODUsImV4cCI6MjA4NjMwOTE4NX0.DNVSSal5mWn4PF_81xJD7eC-SGgbeZhHr1FQkuCG6kw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function saveAppointment(data) {
  try {
    const { data: result, error } = await supabase.from('appointments').insert([data]).select()
    if (error) throw error
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function loadAppointments(filter = 'all') {
  try {
    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data, error } = await query
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message, data: [] }
  }
}

export async function updateAppointmentStatus(id, status) {
  try {
    const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteAppointment(id) {
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// ── Storage helper ─────────────────────────────────────────────────────────────
export async function uploadFile(bucket, file) {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) throw error
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return urlData.publicUrl
}

// ── Gallery ────────────────────────────────────────────────────────────────────
export async function addGalleryItem(data) {
  try {
    const { data: result, error } = await supabase.from('gallery_items').insert([data]).select()
    if (error) throw error
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function loadGalleryItems() {
  try {
    const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message, data: [] }
  }
}

export async function deleteGalleryItem(id) {
  try {
    const { error } = await supabase.from('gallery_items').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// ── Transformations ────────────────────────────────────────────────────────────
export async function addTransformation(data) {
  try {
    const { data: result, error } = await supabase.from('transformations').insert([data]).select()
    if (error) throw error
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function loadTransformations() {
  try {
    const { data, error } = await supabase.from('transformations').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message, data: [] }
  }
}

export async function deleteTransformation(id) {
  try {
    const { error } = await supabase.from('transformations').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// ── Reviews ────────────────────────────────────────────────────────────────────
export async function addReview(data) {
  try {
    const { data: result, error } = await supabase.from('reviews').insert([data]).select()
    if (error) throw error
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function loadReviews() {
  try {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message, data: [] }
  }
}

export async function deleteReview(id) {
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
