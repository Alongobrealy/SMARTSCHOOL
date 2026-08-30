-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES SUPERADMIN & LOCATAIRES (TENANTS)
CREATE TABLE tenant_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  city TEXT,
  address TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  plan TEXT,
  status TEXT,
  license_expires_at DATE,
  master_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE subscription_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  city TEXT,
  student_count INTEGER,
  plan_id TEXT,
  total_cost_fcfa NUMERIC,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'en_attente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABLES CONFIGURATION ECOLE
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenant_schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  attribution TEXT,
  devise TEXT,
  agrement_number TEXT,
  director_name TEXT,
  director_title TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  department TEXT,
  commune TEXT,
  address TEXT,
  annee_scolaire TEXT,
  subjects JSONB DEFAULT '[]'::jsonb,
  active_cycles JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- 4. GESTION DES PROFILS UTILISATEURS (Lié à auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Fonctions utilitaires RLS
CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 5. TABLES OPÉRATIONNELLES (Avec synchronisation client_generated_id)
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  label TEXT,
  description TEXT,
  can_manage_config BOOLEAN DEFAULT false,
  can_manage_students BOOLEAN DEFAULT false,
  can_manage_staff BOOLEAN DEFAULT false,
  can_manage_classes BOOLEAN DEFAULT false,
  can_input_grades BOOLEAN DEFAULT false,
  can_manage_fees BOOLEAN DEFAULT false,
  can_view_reports BOOLEAN DEFAULT false,
  can_print_official_docs BOOLEAN DEFAULT false,
  can_manage_announcements BOOLEAN DEFAULT false,
  can_delete_records BOOLEAN DEFAULT false
);

CREATE TABLE class_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  cycle TEXT,
  niveau TEXT,
  section TEXT,
  capacite_max INTEGER,
  frais_scolarite_fcfa NUMERIC,
  frais_inscription_fcfa NUMERIC,
  salle TEXT,
  professeur_principal TEXT
);

CREATE TABLE staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  matricule TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  role_fonction TEXT,
  departement TEXT,
  telephone TEXT,
  email TEXT,
  genre TEXT,
  salaire_mensuel NUMERIC,
  statut TEXT,
  pin_code TEXT
);

CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  matricule TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  specialite TEXT,
  matieres JSONB DEFAULT '[]'::jsonb,
  telephone TEXT,
  email TEXT,
  genre TEXT,
  statut TEXT,
  salaire_mensuel NUMERIC,
  heures_effectuees NUMERIC,
  classes JSONB DEFAULT '[]'::jsonb,
  pin_code TEXT
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  matricule TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  classe TEXT,
  cycle TEXT,
  filiere TEXT,
  genre TEXT,
  date_naissance DATE,
  nom_parent TEXT,
  telephone_parent TEXT,
  email_parent TEXT,
  frais_total NUMERIC DEFAULT 0,
  frais_payes NUMERIC DEFAULT 0,
  pin_code TEXT,
  parent_pin_code TEXT
);

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT,
  classe TEXT,
  date DATE,
  matiere TEXT,
  statut TEXT,
  heure TEXT,
  parent_notifie BOOLEAN DEFAULT false
);

CREATE TABLE grade_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT,
  classe TEXT,
  matiere TEXT,
  semestre TEXT,
  note_devoir NUMERIC,
  note_examen NUMERIC,
  coefficient NUMERIC,
  appreciation TEXT
);

CREATE TABLE fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  numero_recu TEXT,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT,
  classe TEXT,
  motif TEXT,
  montant NUMERIC,
  date_paiement DATE,
  mode_paiement TEXT,
  reference_transaction TEXT,
  statut TEXT,
  caissier TEXT
);

CREATE TABLE expense_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  titre TEXT,
  categorie TEXT,
  montant NUMERIC,
  date DATE,
  beneficiaire TEXT,
  statut TEXT
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  titre TEXT,
  type TEXT,
  contenu TEXT,
  date_publication DATE,
  auteur TEXT,
  cible TEXT,
  priorite TEXT
);

CREATE TABLE course_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_generated_id TEXT UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  jour TEXT,
  heure_debut TEXT,
  heure_fin TEXT,
  matiere TEXT,
  enseignant TEXT,
  classe TEXT,
  salle TEXT
);

-- 6. POLICIES (RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins can access all schools" ON schools FOR ALL USING (get_user_role() = 'superadmin');
CREATE POLICY "Users can access their own school" ON schools FOR SELECT USING (id = get_user_school_id());

CREATE POLICY "Superadmins can access all profiles" ON profiles FOR ALL USING (get_user_role() = 'superadmin');
CREATE POLICY "Users can access profiles of their school" ON profiles FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Superadmins can access all role_permissions" ON role_permissions FOR ALL USING (get_user_role() = 'superadmin');
CREATE POLICY "Users can access role_permissions of their school" ON role_permissions FOR SELECT USING (school_id = get_user_school_id());

-- Politique génerique pour les tables opérationnelles
CREATE OR REPLACE FUNCTION public.create_tenant_policy(table_name text) RETURNS void AS $$
BEGIN
  EXECUTE format('CREATE POLICY "Superadmins access %I" ON %I FOR ALL USING (get_user_role() = ''superadmin'');', table_name, table_name);
  EXECUTE format('CREATE POLICY "Tenant read access %I" ON %I FOR SELECT USING (school_id = get_user_school_id());', table_name, table_name);
  EXECUTE format('CREATE POLICY "Tenant write access %I" ON %I FOR INSERT WITH CHECK (school_id = get_user_school_id());', table_name, table_name);
  EXECUTE format('CREATE POLICY "Tenant update access %I" ON %I FOR UPDATE USING (school_id = get_user_school_id());', table_name, table_name);
  EXECUTE format('CREATE POLICY "Tenant delete access %I" ON %I FOR DELETE USING (school_id = get_user_school_id());', table_name, table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT public.create_tenant_policy('class_levels');
SELECT public.create_tenant_policy('staff_members');
SELECT public.create_tenant_policy('teachers');
SELECT public.create_tenant_policy('students');
SELECT public.create_tenant_policy('attendance_records');
SELECT public.create_tenant_policy('grade_entries');
SELECT public.create_tenant_policy('fee_payments');
SELECT public.create_tenant_policy('expense_items');
SELECT public.create_tenant_policy('announcements');
SELECT public.create_tenant_policy('course_schedules');
