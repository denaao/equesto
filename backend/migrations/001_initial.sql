-- ============================================
-- EQUESTO - Schema inicial do banco PostgreSQL
-- ============================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  group_name VARCHAR(100),   -- ex: Profissionais, Serviços, Fornecedores...
  icon VARCHAR(50),          -- nome do ícone (ex: stethoscope, truck...)
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: listings (anúncios)
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type VARCHAR(50) CHECK (type IN ('profissional', 'empresa', 'fornecedor')),
  description TEXT,
  services TEXT[],           -- lista de serviços oferecidos
  city VARCHAR(100),
  state VARCHAR(50),
  whatsapp VARCHAR(20),
  phone VARCHAR(20),
  website VARCHAR(300),
  photo_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  approved BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: admin_users
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para busca rápida
-- ============================================
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(featured);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(active, approved);
CREATE INDEX IF NOT EXISTS idx_listings_search ON listings USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));

-- ============================================
-- FUNÇÃO: atualiza updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DADOS INICIAIS: categorias
-- ============================================
INSERT INTO categories (name, slug, group_name, icon, sort_order) VALUES
  -- Profissionais
  ('Veterinários', 'veterinarios', 'Profissionais', 'stethoscope', 1),
  ('Ferradores', 'ferradores', 'Profissionais', 'hammer', 2),
  ('Treinadores', 'treinadores', 'Profissionais', 'user-check', 3),
  ('Agentes de Venda', 'agentes-de-venda', 'Profissionais', 'briefcase', 4),
  ('Despachante Aduaneiro', 'despachante-aduaneiro', 'Profissionais', 'file-text', 5),

  -- Serviços
  ('Transporte de Cavalos', 'transporte-de-cavalos', 'Serviços', 'truck', 10),
  ('Clínicas Veterinárias', 'clinicas-veterinarias', 'Serviços', 'plus-circle', 11),
  ('Hospitais Veterinários', 'hospitais-veterinarios', 'Serviços', 'activity', 12),
  ('Centro de Doma', 'centro-de-doma', 'Serviços', 'award', 13),
  ('Pensionato / Descanso', 'pensionato', 'Serviços', 'home', 14),

  -- Estrutura e Criação
  ('Haras', 'haras', 'Estrutura e Criação', 'map-pin', 20),
  ('Criadores', 'criadores', 'Estrutura e Criação', 'users', 21),
  ('Garanhões', 'garanhoes', 'Estrutura e Criação', 'star', 22),

  -- Fornecedores
  ('Medicamentos', 'medicamentos', 'Fornecedores', 'package', 30),
  ('Farmácias Veterinárias', 'farmacias-veterinarias', 'Fornecedores', 'shopping-bag', 31),
  ('Ração', 'racao', 'Fornecedores', 'box', 32),
  ('Alfafa', 'alfafa', 'Fornecedores', 'leaf', 33),
  ('Aveia', 'aveia', 'Fornecedores', 'layers', 34),
  ('Serragem', 'serragem', 'Fornecedores', 'wind', 35),
  ('Selaria', 'selaria', 'Fornecedores', 'scissors', 36),

  -- Mercado
  ('Agências de Leilão', 'agencias-de-leilao', 'Mercado', 'trending-up', 40),
  ('Leiloeiros', 'leiloeiros', 'Mercado', 'mic', 41),
  ('Venda de Cavalos', 'venda-de-cavalos', 'Mercado', 'dollar-sign', 42),

  -- Informação
  ('Jockey Clubs', 'jockey-clubs', 'Informação', 'flag', 50),
  ('Associação de Criadores', 'associacao-de-criadores', 'Informação', 'shield', 51),
  ('Sites de Apostas', 'sites-de-apostas', 'Informação', 'bar-chart-2', 52),

  -- Outros
  ('Fabricantes de Trailers', 'fabricantes-de-trailers', 'Outros', 'truck', 60),
  ('Empresas de Transporte (Baú)', 'transporte-bau', 'Outros', 'package', 61)

ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ADMIN PADRÃO (senha: equesto@admin123)
-- Trocar antes de colocar em produção!
-- Hash bcrypt gerado externamente
-- ============================================
-- INSERT INTO admin_users (email, password_hash, name)
-- VALUES ('admin@equesto.com.br', '$2b$10$...', 'Admin Equesto');
-- (execute o script seed/create_admin.js para criar o admin)
