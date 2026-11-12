# Samuel Gomes — Portfólio

Portfólio de Desenvolvimento Full Stack e Backend, em português, com projetos, decisões técnicas e formas de contato. O novo layout combina branco gelo, preto, tipografia ampla e animações interativas para dar destaque ao trabalho apresentado.

**[Acessar o portfólio público](https://samuelggds.github.io/Port/)**

O endereço público exibe a versão publicada no GitHub Pages. A atualização visual deste repositório será refletida ali após a integração do novo layout à branch de publicação e a conclusão da implantação.

**[Prévia do novo layout (acesso restrito ao proprietário)](https://samuel-gomes-portfolio-ice.espa-o-de-tr-0598.chatgpt.site)** — nova versão do portfólio para revisão.

## Experiência

- Layout responsivo para computador e celular.
- Seletor com 14 tecnologias: a logo escolhida aparece em destaque com profundidade 3D no próprio contorno, sem cubo de fundo.
- Logos vetoriais das marcas em suas cores originais: React, TypeScript, Node.js, Express, PostgreSQL, Prisma, Supabase, Docker, AWS, GitHub Actions, Vitest, Playwright, HTML e CSS.
- Rotação interativa das logos pelo mouse e teclado.
- Galerias com 10 capturas reais dos três projetos, perspectiva 3D, navegação por setas, indicadores, gestos de toque e ampliação.
- Inclinação das prévias pelo mouse e botões de rotação para celular e teclado.
- Animações de entrada durante a rolagem.
- Filtros por categoria e janelas com detalhes, tecnologias e links de cada projeto.
- Navegação por teclado, indicação de foco e controle para pausar o movimento.
- Respeito à preferência `prefers-reduced-motion` do sistema.
- Links para e-mail, LinkedIn e GitHub, além da opção de copiar o e-mail.

### Explorar as prévias em 3D

Selecione uma tecnologia e arraste sua logo para girar. Com a logo em foco, use as setas do teclado; `Home` restaura a posição. Nas prévias dos projetos, mova o mouse para inclinar a imagem ou use os botões de rotação. Quando a prévia estiver em foco, as setas também controlam a inclinação e `Home` a restaura.

Use as setas ou os indicadores da galeria para trocar de captura; no celular, deslize horizontalmente sobre a imagem. Clique ou toque na captura para ampliar. Na visualização ampliada, as setas esquerda e direita trocam a imagem, e `Esc` fecha a janela. O botão de movimento permite pausar as animações automáticas.

## Projetos apresentados

| Projeto | Contexto e tecnologias | Links |
| --- | --- | --- |
| **GastroNexa** | Plataforma SaaS multi-restaurante independente, com cardápio, pedidos, mesas, pagamentos e delivery. React, TypeScript, Node.js, Express, PostgreSQL e Prisma. | [Código](https://github.com/samuelggds/Projeto-Restaurants) · [Arquitetura](https://github.com/samuelggds/Projeto-Restaurants/blob/main/ARCHITECTURE.md) · [Site do produto](https://www.gastronexa.com.br/) |
| **MG Orçamentos** | Aplicação para clientes, serviços, orçamentos, PDFs e comunicação por e-mail no contexto da MG Refrigerações. React, TypeScript, Supabase, PostgreSQL, AWS e Resend. | [Código](https://github.com/samuelggds/Project-Budget) · [Estudo de caso](https://github.com/samuelggds/samuelggds/blob/main/portfolio/mg-orcamentos.md) |
| **SaaS de Orçamentos** | Projeto independente de orçamentos, estoque, documentos, permissões e assinaturas com cobrança Pix. React, TypeScript, Supabase, Edge Functions, Mercado Pago e Vitest. | [Código](https://github.com/samuelggds/Projeto-Budget-2) · [Estudo de caso](https://github.com/samuelggds/samuelggds/blob/main/portfolio/orcamentos.md) |

As galerias exibem 10 capturas reais das interfaces com dados de demonstração, identificadas no portfólio: quatro da GastroNexa, três de MG Orçamentos e três de SaaS de Orçamentos. As capturas da GastroNexa estão disponíveis no repositório do projeto, em `docs/assets/screenshots/`. As de MG Orçamentos e SaaS de Orçamentos foram feitas com os componentes originais executados localmente, usando dados fictícios e sem acesso ao banco de produção. As imagens não representam métricas reais de clientes, receita ou operação. As origens e os arquivos estão detalhados em [assets/ATTRIBUTION.txt](assets/ATTRIBUTION.txt). O site institucional da MG Refrigerações não é uma demonstração pública do painel.

## Tecnologias do portfólio

HTML semântico, CSS e JavaScript puro, com Canvas 2D para a composição interativa. O site é estático e não exige framework, instalação de dependências ou etapa de compilação.

```text
index.html   Conteúdo, estrutura e metadados
styles.css   Cores, tipografia, layout e responsividade
app.js       Animações, filtros, detalhes dos projetos e contato
assets/      Imagens e recursos visuais
```

## Executar localmente

Na raiz do repositório, use uma das opções:

```sh
npx serve .
```

Abra o endereço local informado no terminal. Se preferir usar Python:

```sh
python -m http.server 5500
```

Nesse caso, acesse [localhost:5500](http://localhost:5500).

## Editar e publicar

Edite os textos e links em `index.html`, o conteúdo dos detalhes dos projetos em `app.js` e o visual em `styles.css`. Mantenha os caminhos de recursos relativos para permitir a publicação no subdiretório `/Port/` do GitHub Pages.

Para publicar pelo GitHub Pages, integre as alterações à branch configurada em **Settings → Pages**. Se a publicação usar uma branch, selecione `master` e a pasta `/ (root)`. Acompanhe a implantação no próprio GitHub antes de considerar a atualização disponível.

## Créditos visuais

Logos das tecnologias: arquivos SVG da coleção [Devicon](https://github.com/devicons/devicon), preservando a arte e as cores das marcas. Os nomes e logos pertencem aos respectivos titulares e identificam as ferramentas utilizadas; não representam endosso. Fonte [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope), distribuída sob SIL Open Font License. As licenças acompanham os arquivos em `assets/`.

## Contato

**Samuel Gomes** · Fortaleza, CE · Desenvolvimento Full Stack e Backend

[E-mail](mailto:accyt2@hotmail.com) · [LinkedIn](https://www.linkedin.com/in/samuel-gomes08/) · [GitHub](https://github.com/samuelggds)
