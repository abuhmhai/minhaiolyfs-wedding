-- Update wedding dress styles and colors
UPDATE Product p
JOIN Category c ON p.categoryId = c.id
SET 
  p.style = CASE 
    WHEN c.slug = 'ao-cuoi' AND p.name LIKE '%BALL GOWN%' THEN 'dang-xoe-ballgown'
    WHEN c.slug = 'ao-cuoi' AND p.name LIKE '%A-LINE%' THEN 'dang-chu-a'
    WHEN c.slug = 'ao-cuoi' AND p.name LIKE '%MERMAID%' THEN 'dang-duoi-ca-mermaid'
    ELSE p.style
  END,
  p.color = CASE 
    WHEN c.slug = 'ao-cuoi' AND p.color = 'offwhite' THEN 'offwhite'
    WHEN c.slug = 'ao-cuoi' AND p.color = 'ivory' THEN 'ivory'
    WHEN c.slug = 'ao-cuoi' AND p.color = 'nude' THEN 'nude'
    WHEN c.slug = 'ao-dai-co-dau' AND p.color = 'red' THEN 'do'
    WHEN c.slug = 'ao-dai-co-dau' AND p.color = 'pink' THEN 'hong'
    WHEN c.slug = 'ao-dai-co-dau' AND p.color = 'white' THEN 'trang'
    ELSE p.color
  END
WHERE c.slug IN ('ao-cuoi', 'ao-dai-co-dau'); 