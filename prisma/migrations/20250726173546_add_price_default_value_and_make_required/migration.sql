-- Altera o tipo de coluna para FLOAT (se já não for) e define um valor padrão temporário para novas entradas
-- Adiciona um SET DEFAULT para o caso de novas entradas, que será removido depois
ALTER TABLE "Project" ALTER COLUMN "price" SET DEFAULT 0.00;

-- Preenche os valores NULL existentes com 0.00
UPDATE "Project" SET "price" = 0.00 WHERE "price" IS NULL;

-- Agora que não há NULLs, torne a coluna obrigatória (NOT NULL)
ALTER TABLE "Project" ALTER COLUMN "price" SET NOT NULL;

-- Remove o valor padrão temporário, se você não quiser que novas entradas sejam 0.00 por padrão.
-- Se você quiser que 0.00 seja o default para novas entradas, mantenha a primeira linha e ignore esta.
ALTER TABLE "Project" ALTER COLUMN "price" DROP DEFAULT;