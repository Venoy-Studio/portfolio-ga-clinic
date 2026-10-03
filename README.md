# Portfolio • G.A Clinic (Perfil dos Sonhos)

Clone de alta fidelidade da landing page da **G.A Clinic** adaptado para fins de portfólio e demonstração profissional, com dados e contatos fictícios para preservação de privacidade e conformidade.

---

## 🚀 Como Visualizar o Projeto

### Opção 1: Abrir direto no navegador
Basta dar duplo clique no arquivo [`index.html`](file:///c:/Users/paulovenoy/Documents/antigravity/happy-salk/index.html) ou abri-lo pelo seu navegador favorito.

### Opção 2: Servidor local (Node.js)
```bash
npm start
# ou
npx serve -l 3000 .
```
Acesse `http://localhost:3000`.

---

## 📁 Estrutura de Arquivos

```
portfolio-ga-clinic/
├── images/
│   ├── results/
│   │   ├── frontal-antes.webp
│   │   ├── frontal-depois.webp
│   │   ├── feminino-definicao-antes.webp
│   │   ├── feminino-definicao-depois.webp
│   │   ├── feminino-contorno-antes.webp
│   │   ├── feminino-contorno-depois.webp
│   │   ├── masculino-antes.webp
│   │   └── masculino-depois.webp
│   ├── amanda-edge-mask.svg
│   ├── amanda-morais.webp
│   ├── ga-symbol-gold.png
│   ├── gabriela-carvalho.webp
│   ├── gabriela-edge-mask.svg
│   ├── hero-v2.webp
│   ├── perfiloplastia-detail.webp
│   └── perfiloplastia-profile.webp
├── index.html
├── style.css
├── app.js
├── package.json
└── README.md
```

---

## 🔒 Dados Fictícios Substituídos

Para proteger a privacidade e os canais de atendimento dos profissionais originais, todos os dados de contato foram substituídos por versões demonstrativas:

- **WhatsApp de Agendamento:** `(11) 99999-0000` (link `wa.me/5511999990000` com mensagem padrão pré-configurada)
- **Instagram da Clínica:** `@gaclinic.estetica` (link `https://instagram.com/gaclinic.estetica`)
- **Instagram Profissional (Dra. Amanda Morais):** `@dra.amandamorais` (link `https://instagram.com/dra.amandamorais`)
- **Instagram Profissional (Dra. Gabriela Carvalho):** `@dra.gabrielacarvalho` (link `https://instagram.com/dra.gabrielacarvalho`)
- **Endereço Fictício:** `Av. Brigadeiro Faria Lima, 1485 · Pinheiros, São Paulo - SP, 01452-002, Brasil`

---

## ✨ Tecnologias e Destaques

- **HTML5 Semântico:** Estrutura clara com marcos de acessibilidade (`header`, `main`, `section`, `dialog`, `footer`, ARIA tags).
- **CSS3 Moderno:** Paleta sofisticada editorial com tons terrosos, dourado acetinado e tipografia nobre (Bodoni Moda & Cormorant Garamond).
- **Animações de Scroll com GSAP & ScrollTrigger:**
  - Revelação de títulos cortados (`.title-reveal`) e parallax fluido na imagem hero.
  - Análise anatômica na Perfiloplastia com desenho dinâmico de guias e marcadores (Nariz, Lábios, Mento).
  - Pinned scrub morphing na seção das profissionais (Amanda Morais para Gabriela Carvalho com máscaras SVG).
  - Transição cinematográfica do FAQ para o CTA de agendamento em fundo dourado escuro.
- **Lenis Smooth Scroll:** Rolagem inercial de luxo ultra suave (momentum scroll), 100% offline.
- **Totalmente Responsivo & Respeito a Movimento Reduzido:** Adaptado para mobile e compatível com `prefers-reduced-motion`.
