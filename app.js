(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = motionPreference.matches;
  let drawOrb = () => {};

  const motionButton = $('#motion-toggle');
  const motionLabel = $('[data-motion-label]');
  function updateMotion() {
    document.body.classList.toggle('motion-paused', motionPaused);
    motionButton?.setAttribute('aria-pressed', String(!motionPaused));
    if (motionLabel) motionLabel.textContent = motionPaused ? 'Ativar movimento' : 'Pausar movimento';
    drawOrb();
  }
  motionButton?.addEventListener('click', () => {
    motionPaused = !motionPaused;
    updateMotion();
  });
  motionPreference.addEventListener('change', (event) => {
    motionPaused = event.matches;
    updateMotion();
    if (event.matches) $$('.reveal').forEach((element) => element.classList.add('is-visible'));
  });
  updateMotion();

  // Content remains readable when JavaScript or observers are unavailable.
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
    $$('.reveal').forEach((element) => revealObserver.observe(element));
    document.body.classList.add('js-ready');
  } else {
    $$('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  const header = $('#site-header');
  let scrollPending = false;
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    scrollPending = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive: true });
  updateHeader();

  const menuButton = $('#menu-toggle');
  const mainNav = $('#main-nav');
  function closeMenu() {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    mainNav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mainNav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  $$('a', mainNav || document.createElement('nav')).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 681px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  const filterButtons = $$('[data-filter]');
  const projects = $$('[data-category]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      projects.forEach((project) => {
        const visible = filter === 'all' || project.dataset.category.split(' ').includes(filter);
        project.hidden = !visible;
        if (visible) {
          count += 1;
          project.classList.add('is-visible');
        }
      });
      const status = $('#filter-status');
      if (status) status.textContent = `${count} ${count === 1 ? 'projeto encontrado' : 'projetos encontrados'}.`;
    });
  });

  const projectData = {
    gastronexa: {
      name: 'GastroNexa',
      category: '01 / Plataforma SaaS para restaurantes',
      description: 'Uma plataforma SaaS multi-restaurante que conecta cardápio, pedidos, mesas, cozinha, pagamentos e delivery.',
      stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Docker'],
      details: [
        'Arquitetura multi-tenant, autenticação JWT e controle de permissões.',
        'Integração de pagamentos por webhooks e atualizações em tempo real.',
        'Documentação de arquitetura, testes e implantação com Docker e CI/CD.'
      ],
      repo: 'https://github.com/samuelggds/Projeto-Restaurants',
      demo: 'https://www.gastronexa.com.br/'
    },
    mg: {
      name: 'MG Orçamentos',
      category: '02 / Gestão empresarial',
      description: 'Aplicação independente desenvolvida no contexto da MG Refrigerações para organizar clientes, serviços e orçamentos em um só lugar.',
      stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'AWS', 'Tauri'],
      details: [
        'Fluxo de acompanhamento: enviado, em andamento, aprovado e pago.',
        'Geração de orçamentos em PDF e envio de e-mails com Resend.',
        'Persistência em PostgreSQL com políticas de segurança RLS.'
      ],
      repo: 'https://github.com/samuelggds/Project-Budget',
      demo: null
    },
    budget: {
      name: 'SaaS de Orçamentos',
      category: '03 / Software como serviço',
      description: 'Projeto pessoal de uma plataforma SaaS para gerenciar clientes, serviços, estoque e orçamentos empresariais.',
      stack: ['React', 'TypeScript', 'Supabase', 'Deno', 'Mercado Pago', 'Vitest'],
      details: [
        'Organização de clientes, serviços e estoque, com exportação de PDFs.',
        'Perfis de acesso e operações de backend com Edge Functions.',
        'Assinaturas e integração de pagamentos Pix pelo Mercado Pago.'
      ],
      repo: 'https://github.com/samuelggds/Projeto-Budget-2',
      demo: null
    }
  };
  const dialog = $('#project-dialog');
  let dialogTrigger = null;
  function setText(selector, text) {
    const element = $(selector);
    if (element) element.textContent = text;
  }
  function fillItems(selector, values, tagName) {
    const element = $(selector);
    if (!element) return;
    element.replaceChildren(...values.map((value) => {
      const item = document.createElement(tagName);
      item.textContent = value;
      return item;
    }));
    element.hidden = values.length === 0;
  }
  $$('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const project = projectData[button.dataset.project];
      if (!project || !dialog) return;
      dialogTrigger = button;
      setText('#dialog-title', project.name);
      setText('#dialog-kicker', project.category);
      setText('#dialog-description', project.description);
      fillItems('#dialog-stack', project.stack, 'span');
      fillItems('#dialog-details', project.details, 'li');
      const repo = $('#dialog-repo');
      const demo = $('#dialog-demo');
      if (repo) repo.href = project.repo;
      if (demo) {
        demo.hidden = !project.demo;
        if (project.demo) demo.href = project.demo;
        else demo.removeAttribute('href');
      }
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  $('#dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      dialog.close();
    }
  });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    dialogTrigger?.focus({ preventScroll: true });
  });

  $('#copy-email')?.addEventListener('click', async () => {
    const email = 'accyt2@hotmail.com';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      setText('#copy-status', 'E-mail copiado!');
    } catch {
      setText('#copy-status', `Copie o e-mail: ${email}`);
      const address = $('[data-email-address]');
      if (address && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(address);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });

  const galleryData = {
    gastronexa: { name: 'GastroNexa', images: [
      ['gastronexa-customer-menu.png', 'Cardápio digital'],
      ['gastronexa-admin-dashboard.png', 'Painel administrativo'],
      ['gastronexa-kitchen-dashboard.png', 'Operação da cozinha'],
      ['gastronexa-waiter-dashboard.png', 'Atendimento e mesas']
    ] },
    mg: { name: 'MG Orçamentos', images: [
      ['mg-historico.jpg', 'Histórico de orçamentos'],
      ['mg-novo.jpg', 'Criação de propostas'],
      ['mg-clientes.jpg', 'Cadastro de clientes']
    ] },
    budget: { name: 'SaaS de Orçamentos', images: [
      ['saas-financeiro.jpg', 'Painel financeiro'],
      ['saas-estoque.jpg', 'Gestão de estoque'],
      ['saas-novo.jpg', 'Criação de orçamentos']
    ] }
  };
  const galleryDialog = $('#gallery-dialog');
  const galleryControllers = new Map();
  let activeGallery = null;
  let galleryTrigger = null;
  function refreshLightbox() {
    if (!activeGallery) return;
    const { data, index } = activeGallery;
    const [file, caption] = data.images[index];
    $('#lightbox-image').src = 'assets/screenshots/' + file;
    $('#lightbox-image').alt = data.name + ': ' + caption + ', em ambiente de demonstração';
    setText('#gallery-dialog-title', data.name);
    setText('#lightbox-caption', caption);
    setText('#lightbox-count', String(index + 1).padStart(2, '0') + ' / ' + String(data.images.length).padStart(2, '0'));
  }
  $$('[data-gallery]').forEach((gallery) => {
    const data = galleryData[gallery.dataset.gallery];
    const controller = { data, index: 0, set: null };
    const dots = $('.gallery-dots', gallery);
    const photo = $('.gallery-image', gallery);
    function show(index) {
      controller.index = (index + data.images.length) % data.images.length;
      const [file, caption] = data.images[controller.index];
      photo.src = 'assets/screenshots/' + file;
      photo.alt = data.name + ': ' + caption + ', em ambiente de demonstração';
      $('.gallery-title', gallery).textContent = caption;
      $('.gallery-counter', gallery).textContent = String(controller.index + 1).padStart(2, '0') + ' / ' + String(data.images.length).padStart(2, '0');
      $$('button', dots).forEach((button, i) => {
        button.setAttribute('aria-pressed', String(i === controller.index));
        button.classList.toggle('is-active', i === controller.index);
      });
      if (!motionPaused && photo.animate) photo.animate([{opacity:0.45, transform:'translateX(8px)'},{opacity:1, transform:'translateX(0)'}],{duration:260,easing:'ease-out'});
      if (activeGallery === controller && galleryDialog.open) refreshLightbox();
    }
    controller.set = show;
    galleryControllers.set(gallery.dataset.gallery, controller);
    data.images.forEach(([, caption], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', data.name + ': mostrar ' + caption);
      button.setAttribute('aria-pressed', String(index === 0));
      button.className = index === 0 ? 'is-active' : '';
      button.addEventListener('click', () => show(index));
      dots.append(button);
    });
    $('.gallery-prev', gallery).addEventListener('click', () => show(controller.index - 1));
    $('.gallery-next', gallery).addEventListener('click', () => show(controller.index + 1));
    const expand = $('.gallery-expand', gallery);
    let touchStart = null;
    let swiped = false;
    expand.addEventListener('touchstart', (event) => { touchStart = {x:event.touches[0].clientX,y:event.touches[0].clientY}; swiped = false; }, {passive:true});
    expand.addEventListener('touchend', (event) => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { show(controller.index + (dx < 0 ? 1 : -1)); swiped = true; }
      touchStart = null;
    }, {passive:true});
    expand.addEventListener('click', () => {
      if (swiped) { swiped = false; return; }
      activeGallery = controller;
      galleryTrigger = expand;
      refreshLightbox();
      galleryDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  $('#gallery-close')?.addEventListener('click', () => galleryDialog.close());
  $('#lightbox-prev')?.addEventListener('click', () => activeGallery?.set(activeGallery.index - 1));
  $('#lightbox-next')?.addEventListener('click', () => activeGallery?.set(activeGallery.index + 1));
  galleryDialog?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); activeGallery?.set(activeGallery.index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); activeGallery?.set(activeGallery.index + 1); }
  });
  galleryDialog?.addEventListener('click', (event) => {
    if(event.target !== galleryDialog) return;
    const r = galleryDialog.getBoundingClientRect();
    if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) galleryDialog.close();
  });
  galleryDialog?.addEventListener('close', () => { document.body.classList.remove('dialog-open'); galleryTrigger?.focus({preventScroll:true}); });

  // Interactive project showcases. Native controls offer the same rotation on
  // touch screens; mouse tilting never captures the page's scrolling gestures.
  $$('.project-visual, .feature-visual').forEach((visual) => {
    const article = visual.closest('.project-card');
    const name = $('h3', article)?.textContent.trim() || 'projeto';
    let tiltX = 0;
    let tiltY = 0;
    const paint = () => {
      visual.style.setProperty('--tilt-x', tiltX + 'deg');
      visual.style.setProperty('--tilt-y', tiltY + 'deg');
      visual.classList.toggle('is-tilted', Math.abs(tiltX) + Math.abs(tiltY) > 0);
    };
    const reset = () => { tiltX = 0; tiltY = 0; paint(); };
    visual.classList.add('project-3d');
    visual.tabIndex = 0;
    visual.setAttribute('role', 'group');
    visual.setAttribute('aria-label', 'Prévia 3D de ' + name + '. Use as setas para girar e Home para restaurar.');
    visual.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || motionPaused || event.target.closest('.gallery-nav, .project-3d-controls')) return;
      const own = visual.getBoundingClientRect();
      tiltY = Math.max(-12, Math.min(12, ((event.clientX - own.left) / own.width - 0.5) * 24));
      tiltX = Math.max(-9, Math.min(9, -((event.clientY - own.top) / own.height - 0.5) * 18));
      visual.style.setProperty('--shine-x', ((event.clientX - own.left) / own.width * 100) + '%');
      visual.style.setProperty('--shine-y', ((event.clientY - own.top) / own.height * 100) + '%');
      paint();
    });
    visual.addEventListener('pointerleave', reset);
    visual.addEventListener('keydown', (event) => {
      if (event.target !== visual) return;
      if (event.key === 'ArrowLeft') tiltY = Math.max(-18, tiltY - 6);
      else if (event.key === 'ArrowRight') tiltY = Math.min(18, tiltY + 6);
      else if (event.key === 'ArrowUp') tiltX = Math.max(-12, tiltX - 6);
      else if (event.key === 'ArrowDown') tiltX = Math.min(12, tiltX + 6);
      else if (event.key === 'Home') { reset(); event.preventDefault(); return; }
      else return;
      event.preventDefault(); paint();
    });
    const controls = document.createElement('div');
    controls.className = 'project-3d-controls';
    const label = document.createElement('span');
    label.textContent = 'EXPLORE EM 3D';
    controls.append(label);
    [['↶', 'Girar à esquerda', -1], ['↺', 'Restaurar posição', 0], ['↷', 'Girar à direita', 1]].forEach(([glyph, title, direction]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = glyph;
      button.setAttribute('aria-label', title + ': ' + name);
      button.addEventListener('click', () => {
        if (!direction) reset();
        else { tiltY = Math.max(-18, Math.min(18, tiltY + direction * 9)); tiltX = -5; paint(); }
      });
      controls.append(button);
    });
    visual.append(controls);
    motionButton?.addEventListener('click', reset);
    motionPreference.addEventListener('change', reset);
  });

  // A dependency-free, interactive study of the technologies behind the work.
  // Brand artwork is projected onto layered transparent planes. Only the logo
  // silhouette is extruded: no box, tile, or rectangular backing is rendered.
  const canvas = $('#orb');
  const stage = canvas?.closest('.orb-stage');
  const context = canvas?.getContext('2d');
  if (!canvas || !stage || !context) return;

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let frame = 0;
  let previousTime = 0;
  let rotation = 0;
  let inView = true;
  let drag = null;
  let dragX = 0;
  let dragY = 0;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  const TAU = Math.PI * 2;
  const technologies = [
    {name:'TypeScript',asset:'typescript'}, {name:'React',asset:'react'},
    {name:'Node.js',asset:'nodejs'}, {name:'Express',asset:'express'},
    {name:'PostgreSQL',asset:'postgresql'}, {name:'Prisma',asset:'prisma'},
    {name:'Supabase',asset:'supabase'}, {name:'Docker',asset:'docker'},
    {name:'AWS',asset:'aws'}, {name:'GitHub Actions',asset:'githubactions'},
    {name:'Vitest',asset:'vitest'}, {name:'Playwright',asset:'playwright'},
    {name:'HTML',asset:'html'}, {name:'CSS',asset:'css'}
  ];
  technologies.forEach(tech=>{
    tech.image=new Image();
    tech.image.onload=()=>{
      const silhouette=document.createElement('canvas');
      silhouette.width=512; silhouette.height=512;
      const ink=silhouette.getContext('2d');
      ink.drawImage(tech.image,0,0,512,512);
      ink.globalCompositeOperation='source-in';
      ink.fillStyle='#929699';
      ink.fillRect(0,0,512,512);
      tech.silhouette=silhouette;
      drawOrb();
    };
    tech.image.src='assets/logos/'+tech.asset+'.svg';
  });
  let activeTech = technologies[0];
  let changePulse = 0;
  const orbit = $('#stack-orbit');
  technologies.forEach((tech,index) => {
    const button = document.createElement('button');
    const angle = -Math.PI / 2 + index / technologies.length * TAU;
    button.type = 'button';
    button.className = 'stack-orbit-button' + (index === 0 ? ' is-selected' : '');
    button.dataset.tech = tech.name;
    button.title = tech.name;
    button.setAttribute('aria-label', 'Destacar ' + tech.name + ' em 3D');
    button.setAttribute('aria-pressed', String(index === 0));
    button.style.setProperty('--orbit-x', (50 + Math.cos(angle) * 43) + '%');
    button.style.setProperty('--orbit-y', (49 + Math.sin(angle) * 40) + '%');
    const glyph = document.createElement('img');
    glyph.className = 'tech-glyph';
    glyph.src='assets/logos/'+tech.asset+'.svg';
    glyph.alt='';
    glyph.width=24; glyph.height=24;
    glyph.setAttribute('aria-hidden','true');
    const name = document.createElement('span');
    name.className = 'tech-name';
    name.textContent = tech.name;
    button.append(glyph,name);
    button.addEventListener('click', () => {
      activeTech = tech;
      changePulse = motionPaused ? 0 : 1;
      dragX = 0; dragY = 0;
      $$('.stack-orbit-button',orbit).forEach(item => {
        item.classList.toggle('is-selected',item === button);
        item.setAttribute('aria-pressed',String(item === button));
      });
      setText('#active-stack-label',tech.name);
      canvas.setAttribute('aria-label',tech.name + ' em 3D. Arraste com o mouse ou use as setas para girar. Home restaura a posição.');
      drawOrb();
    });
    orbit?.append(button);
  });
  const vertex = (x, y, z) => ({ x, y, z });
  function project(point, yaw, pitch, roll) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    const x1 = point.x * cy + point.z * sy;
    const z1 = -point.x * sy + point.z * cy;
    const y2 = point.y * cp - z1 * sp;
    const z2 = point.y * sp + z1 * cp;
    const x3 = x1 * cr - y2 * sr;
    const y3 = x1 * sr + y2 * cr;
    const scale = Math.min(width, height) / 3.9 * (1 - changePulse * 0.12);
    return { x: width * 0.5 + x3 * scale, y: height * 0.49 + y3 * scale, z: z2 };
  }

  function drawLogoPlane(image,z,yaw,pitch,roll,lift) {
    const ratio=activeTech.image.naturalWidth/activeTech.image.naturalHeight;
    const halfWidth=ratio>=1?1:ratio;
    const halfHeight=ratio>=1?1/ratio:1;
    const a=project(vertex(-halfWidth,-halfHeight,z),yaw,pitch,roll);
    const b=project(vertex(halfWidth,-halfHeight,z),yaw,pitch,roll);
    const d=project(vertex(-halfWidth,halfHeight,z),yaw,pitch,roll);
    context.save();
    context.transform((b.x-a.x)/512,(b.y-a.y)/512,(d.x-a.x)/512,(d.y-a.y)/512,a.x,a.y+lift);
    context.drawImage(image,0,0,512,512);
    context.restore();
  }

  function render(time = 0) {
    frame = 0;
    const elapsed = previousTime ? Math.min(time - previousTime, 40) : 16;
    previousTime = time;
    const animate = !motionPaused && inView && !document.hidden;
    if (animate) rotation += elapsed * 0.00038;
    if (changePulse > 0) changePulse = Math.max(0, changePulse - elapsed * 0.004);
    const ease = motionPaused ? 1 : 0.065;
    pointerX += (targetX - pointerX) * ease;
    pointerY += (targetY - pointerY) * ease;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const shadow = context.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.36);
    shadow.addColorStop(0, 'rgba(24,32,27,0.19)');
    shadow.addColorStop(1, 'rgba(24,32,27,0)');
    context.save();
    context.translate(width * 0.5, height * 0.77);
    context.scale(1, 0.15);
    context.fillStyle = shadow;
    context.beginPath();
    context.arc(0, 0, Math.min(width, height) * 0.36, 0, TAU);
    context.fill();
    context.restore();

    // A quiet orbital line visually connects the stack without visual clutter.
    context.strokeStyle = 'rgba(97,111,101,0.15)';
    context.lineWidth = 1;
    context.beginPath();
    context.ellipse(width * 0.5, height * 0.49, width * 0.43, height * 0.40, 0, 0, TAU);
    context.stroke();

    const yaw = -0.22 + Math.sin(rotation * 0.55) * 0.10 + pointerX * 0.17 + dragX;
    const pitch = -0.12 + Math.cos(rotation * 0.45) * 0.055 + pointerY * 0.12 + dragY;
    const roll = -0.055 + Math.sin(rotation * 0.4) * 0.025;
    const lift = Math.sin(rotation) * Math.min(height * 0.014, 5);
    if(activeTech.image.complete && activeTech.image.naturalWidth && activeTech.silhouette) {
      // Repeated alpha silhouettes produce a thin solid extrusion of the actual
      // artwork. The untouched original SVG is always the visible front face.
      for(let layer=0;layer<22;layer++){
        drawLogoPlane(activeTech.silhouette,-0.15+layer*0.014,yaw,pitch,roll,lift);
      }
      drawLogoPlane(activeTech.image,0.16,yaw,pitch,roll,lift);
    }

    if (animate || changePulse > 0) frame = requestAnimationFrame(render);
  }

  drawOrb = () => {
    if (!frame && !document.hidden && inView) frame = requestAnimationFrame(render);
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    drawOrb();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });

  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    if (drag && drag.id === event.pointerId) {
      dragX = Math.max(-0.8,Math.min(0.8,drag.startX + (event.clientX - drag.x) * 0.008));
      dragY = Math.max(-0.6, Math.min(0.6, drag.startY + (event.clientY - drag.y) * 0.008));
    } else if (event.pointerType === 'mouse' && !motionPaused) {
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    drawOrb();
  });
  canvas.addEventListener('pointerdown', (event) => {
    // Keep ordinary touch scrolling available on mobile.
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: dragX, startY: dragY };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('is-dragging');
  });
  function releaseDrag() {
    drag = null;
    canvas.classList.remove('is-dragging');
  }
  canvas.addEventListener('pointerup', releaseDrag);
  canvas.addEventListener('pointercancel', releaseDrag);
  canvas.addEventListener('lostpointercapture', releaseDrag);
  stage.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    drawOrb();
  });
  canvas.addEventListener('keydown', (event) => {
    const step = 0.15;
    if (event.key === 'ArrowLeft') dragX -= step;
    else if (event.key === 'ArrowRight') dragX += step;
    else if (event.key === 'ArrowUp') dragY -= step;
    else if (event.key === 'ArrowDown') dragY += step;
    else if (event.key === 'Home') { dragX = 0; dragY = 0; }
    else return;
    dragX = Math.max(-0.8, Math.min(0.8, dragX));
    dragY = Math.max(-0.6, Math.min(0.6, dragY));
    event.preventDefault();
    drawOrb();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView && frame) { cancelAnimationFrame(frame); frame = 0; }
      previousTime = 0;
      if (inView) drawOrb();
    }, { rootMargin: '80px' }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    previousTime = 0;
    if (!document.hidden) drawOrb();
  });
  resize();
})();
