(function () {
  const $ = (id) => document.getElementById(id);

  const state = {
    items: [],
    companies: [],
    selectedCompany: null
  };

  // Load companies from JSON
  async function loadCompanies() {
    try {
      const response = await fetch('companies.json');
      if (!response.ok) throw new Error('Failed to load companies');
      const data = await response.json();
      state.companies = data.companies || [];

      // Populate selector
      const select = $("companySelect");
      if (select && state.companies.length > 0) {
        select.innerHTML = state.companies.map(c =>
          `<option value="${c.id}">${c.nombre_comercial}</option>`
        ).join('');

        // Load last selected company from localStorage or select first
        const savedId = localStorage.getItem('selectedCompanyId');
        const companyToSelect = state.companies.find(c => c.id === savedId) || state.companies[0];
        selectCompany(companyToSelect.id);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      // Fallback: use default hardcoded data
      state.selectedCompany = {
        id: 'dtg',
        ruc: '20601030013',
        nombre_comercial: 'DIGITAL TRADE GROUP',
        tagline: 'TECHNOLOGY & IMPORTS',
        logo: 'assets/logo.jpeg',
        banco: 'BCP',
        cuenta: '1917234591075',
        cci: '00219100723459107555',
        titular: 'DIGITAL WAVE IMPORTS SAC'
      };
    }
  }

  // Select and apply company
  function selectCompany(companyId) {
    const company = state.companies.find(c => c.id === companyId);
    if (!company) return;

    state.selectedCompany = company;
    localStorage.setItem('selectedCompanyId', companyId);

    // Update selector value
    const select = $("companySelect");
    if (select) select.value = companyId;

    // Update branding
    updateBranding();

    // Apply company theme
    applyTheme(company);
  }

  function applyTheme(company) {
    if (!company.theme) return;

    const root = document.documentElement;
    const t = company.theme;

    // Titular
    const titularEl = document.getElementById('sheetTitular');
    if (titularEl) { // Added check for titularEl existence
      if (t.titular) {
        titularEl.textContent = t.titular;
        titularEl.style.display = 'block';
      } else {
        titularEl.style.display = 'none';
      }
    }

    // Document Title (Cotización vs Proforma)
    const docTitleLabelv = document.getElementById('documentTitleLabel');
    if (docTitleLabelv) {
      docTitleLabelv.textContent = company.documentTitle || "COTIZACIÓN";
    }

    // Dynamic Labels (Señores/Cliente vs Producto/Nombre)
    const labels = company.labels || {};
    const labelClientRel = document.getElementById('label_client');
    if (labelClientRel) labelClientRel.textContent = labels.client || "Señores:";

    const labelItemRel = document.getElementById('label_item_header');
    if (labelItemRel) labelItemRel.textContent = labels.itemHeader || "DESCRIPCIÓN";

    // Set Theme Variables
    root.style.setProperty('--theme-primary', t.primary);
    root.style.setProperty('--theme-secondary', t.secondary);
    root.style.setProperty('--theme-accent', t.accent);
    root.style.setProperty('--theme-header-font', t.headerFont);
    root.style.setProperty('--theme-body-font', t.bodyFont);
    root.style.setProperty('--theme-header-weight', t.headerWeight);

    // Update App Interface Accents
    root.style.setProperty('--accent', t.accent);

    // Apply Layout Variant (New)
    const sheetRoot = document.getElementById("pdfRoot");
    if (sheetRoot) {
      // Remove previous layout classes
      sheetRoot.classList.remove('layout-inverted', 'layout-standard');

      // Add new layout class if defined
      if (t.layout) {
        sheetRoot.classList.add(`layout-${t.layout}`);
      }

      // Footer Classes
      sheetRoot.classList.remove('footer-hidden', 'footer-small');
      if (t.footerStyle) {
        sheetRoot.classList.add(`footer-${t.footerStyle}`);
      }

      // Micro-Design: Shadow
      if (t.boxShadow === true) {
        sheetRoot.classList.add('shadow-active');
      } else {
        sheetRoot.classList.remove('shadow-active');
      }

      // Micro-Design: Radius & Font
      const radiusValue = t.borderRadius === 'square' ? '0px' : '10px';
      sheetRoot.style.setProperty('--theme-radius', radiusValue);

      if (t.quoteFont) {
        sheetRoot.style.setProperty('--theme-quote-font', t.quoteFont);
      } else {
        sheetRoot.style.removeProperty('--theme-quote-font');
      }

      if (t.quoteTitleFont) {
        sheetRoot.style.setProperty('--theme-quote-title-font', t.quoteTitleFont);
      } else {
        sheetRoot.style.removeProperty('--theme-quote-title-font');
      }
    }
  }

  // Update all branding elements
  function updateBranding() {
    const c = state.selectedCompany;
    if (!c) return;

    // Update topbar logo and name
    const brandLogo = $("brandLogo");
    const brandName = $("brandName");
    const brandTag = $("brandTag");

    if (brandLogo) brandLogo.src = c.logo;
    if (brandName) brandName.textContent = c.nombre_comercial;
    if (brandTag) brandTag.textContent = c.tagline;

    // Update PDF preview logo and name
    const sheetLogo = $("sheetLogo");
    const sheetBrandName = $("sheetBrandName");
    const sheetContactInfo = $("sheetContactInfo");
    const sheetEmail = $("sheetEmail");

    if (sheetLogo) sheetLogo.src = c.logo;
    if (sheetBrandName) sheetBrandName.textContent = c.nombre_comercial;

    // Update PDF header contact info (RUC and Celular instead of address)
    if (sheetContactInfo) {
      let contactHtml = `<div>RUC: ${c.ruc}</div>`;
      if (c.celular && c.celular.trim().length > 0) {
        contactHtml += `<div>CEL: ${c.celular}</div>`;
      }
      sheetContactInfo.innerHTML = contactHtml;
    }
    if (sheetEmail) sheetEmail.textContent = c.correo || '';

    // Update footer signature
    const footerBrandName = $("footerBrandName");
    const footerBrandTag = $("footerBrandTag");

    if (footerBrandName) footerBrandName.textContent = c.nombre_comercial;
    if (footerBrandTag) footerBrandTag.textContent = c.tagline;

    // Update bank information
    const bankAccount = $("bankAccount");
    const bankCCI = $("bankCCI");
    const bankHolder = $("bankHolder");
    const bankLogo = $("bankLogo");

    if (bankAccount) bankAccount.textContent = `CTA CORRIENTE ${c.banco} ${c.cuenta}`;
    if (bankCCI) bankCCI.textContent = `CCI ${c.cci}`;
    if (bankHolder) bankHolder.textContent = c.titular;

    // Update bank logo based on bank name
    if (bankLogo) {
      const logoMap = {
        'BBVA': 'assets/logo_bbva.png',
        'BCP': 'assets/bcp_logo.jpg'
      };
      bankLogo.src = logoMap[c.banco] || 'assets/bcp_logo.jpg';
      bankLogo.alt = c.banco || 'BCP';
    }

    // Hide benefits for RUC starting with 10
    const benefitsSection = document.querySelector('.benefits');
    if (benefitsSection) {
      if (c.ruc && c.ruc.toString().startsWith('10')) {
        benefitsSection.style.display = 'none';
      } else {
        benefitsSection.style.display = 'block';
      }
    }

    console.log('✓ Branding updated:', c.nombre_comercial);
  }

  function todayISO() {
    const d = new Date();
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }

  function fmtMoney(value) {
    const curr = $("currency").value || "S/";
    const n = Number(value || 0);
    // Keep it simple and PDF-safe (no Intl locale dependence for canvas)
    const fixed = n.toFixed(2);
    return `${curr} ${fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }

  function toNumber(v) {
    const n = Number(String(v).replace(/,/g, '').trim());
    return isFinite(n) ? n : 0;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function addItem(prefill) {
    const item = {
      desc: prefill?.desc ?? "",
      modelo: prefill?.modelo ?? "",
      marca: prefill?.marca ?? "",
      cant: prefill?.cant ?? 1,
      priceIncIGV: prefill?.priceIncIGV ?? 0,
      unit: prefill?.unit ?? "UND",
      image: prefill?.image ?? null
    };
    state.items.push(item);
    renderItems();
    syncPreview();
  }

  function removeItem(idx) {
    state.items.splice(idx, 1);
    renderItems();
    syncPreview();
  }

  function handleImageUpload(file, itemIndex) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar imagen a máximo 100x100px manteniendo proporción
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = 100;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width / height) * maxSize;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Actualizar item
        state.items[itemIndex].image = dataUrl;
        renderItems();
        syncPreview();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function renderItems() {
    const body = $("itemsBody");
    body.innerHTML = "";

    state.items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "itemRow";

      row.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 700; color: var(--muted); font-size: 14px;">Ítem #${idx + 1}</div>
        </div>
        <div class="field">
          <label>Imagen (opcional)</label>
          <div class="image-upload">
            ${it.image ? `
              <img src="${it.image}" alt="Imagen del ítem" class="item-thumbnail" />
              <button class="btnRemoveImage" data-i="${idx}" type="button" title="Eliminar imagen">✕ Eliminar</button>
            ` : `
              <input type="file" accept="image/*" class="imageInput" data-i="${idx}" />
              <span style="font-size: 11px; color: #667085;">JPG, PNG - Máx 5MB</span>
            `}
          </div>
        </div>
        <div class="field">
          <label>Descripción</label>
          <input data-k="desc" data-i="${idx}" placeholder="Descripción del producto/servicio" value="${escapeHtml(it.desc)}" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="field">
            <label>Modelo</label>
            <input data-k="modelo" data-i="${idx}" placeholder="Modelo" value="${escapeHtml(it.modelo)}" />
          </div>
          <div class="field">
            <label>Marca</label>
            <input data-k="marca" data-i="${idx}" placeholder="Marca" value="${escapeHtml(it.marca)}" />
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="field">
            <label>Cantidad</label>
            <input data-k="cant" data-i="${idx}" type="number" min="0" step="0.01" value="${escapeHtml(it.cant)}" />
          </div>
          <div class="field">
            <label>Unidad</label>
            <input data-k="unit" data-i="${idx}" placeholder="UND" value="${escapeHtml(it.unit)}" />
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="field">
            <label>Precio</label>
            <input data-k="priceIncIGV" data-i="${idx}" type="number" min="0" step="0.01" value="${escapeHtml(it.priceIncIGV)}" />
          </div>
          <div class="field">
            <label>Total</label>
            <input disabled class="importe-field" data-i="${idx}" value="${(toNumber(it.cant) * toNumber(it.priceIncIGV)).toFixed(2)}" />
          </div>
        </div>
        <button class="btnDel" type="button" title="Eliminar">✕</button>
      `;

      row.querySelector(".btnDel").addEventListener("click", () => removeItem(idx));

      // Handle image input
      const imageInput = row.querySelector('.imageInput');
      if (imageInput) {
        imageInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            handleImageUpload(file, idx);
          }
        });
      }

      // Handle image removal
      const btnRemoveImage = row.querySelector('.btnRemoveImage');
      if (btnRemoveImage) {
        btnRemoveImage.addEventListener('click', () => {
          state.items[idx].image = null;
          renderItems();
          syncPreview();
        });
      }

      row.querySelectorAll("input[data-k]").forEach(inp => {
        inp.addEventListener("input", (e) => {
          const k = e.target.getAttribute("data-k");
          const i = Number(e.target.getAttribute("data-i"));
          const isStringField = ["desc", "unit", "modelo", "marca"].includes(k);
          state.items[i][k] = isStringField ? e.target.value : toNumber(e.target.value);

          // Only update the importe field for this row, don't re-render everything
          if (k === "cant" || k === "priceIncIGV") {
            const importeField = document.querySelector(`.importe-field[data-i="${i}"]`);
            if (importeField) {
              importeField.value = (toNumber(state.items[i].cant) * toNumber(state.items[i].priceIncIGV)).toFixed(2);
            }
          }

          syncPreview();
        });
      });

      body.appendChild(row);
    });
  }

  function computeTotals() {
    const subtotal = state.items.reduce((acc, it) => acc + toNumber(it.cant) * toNumber(it.priceIncIGV), 0);
    const discount = toNumber($("discount").value);
    const taxable = Math.max(0, subtotal - discount);
    const rate = toNumber($("taxRate").value) / 100;
    const tax = taxable * rate;
    const total = taxable + tax;
    return { subtotal, discount, tax, total };
  }

  function setText(id, value) {
    const el = $(id);
    if (!el) return;
    const text = (value && String(value).trim().length) ? String(value) : "—";
    el.textContent = text;
  }

  // Fetch RUC data from API and autocomplete fields
  async function fetchRUCData(ruc) {
    // Validate RUC format (11 digits for Peru)
    if (!ruc || ruc.length !== 11 || !/^\d{11}$/.test(ruc)) {
      return;
    }

    // Use local proxy to avoid CORS issues
    const apiUrl = `/api/ruc/${ruc}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const apiResponse = await response.json();

      // Handle both API formats:
      // 1. Decolecta API: { razon_social, direccion, departamento, ... }
      // 2. Consultaruc API: { response: true, result: { razon_social, estado, condicion } }
      let data;

      if (apiResponse.result && apiResponse.response) {
        // consultaruc.win format (fallback API)
        data = apiResponse.result;
        console.log('Using consultaruc.win data (basic info only)');
      } else if (apiResponse.razon_social) {
        // decolecta.com format (primary API with full data)
        data = apiResponse;
        console.log('Using decolecta.com data (full info)');
      } else {
        throw new Error('No se encontró información para este RUC');
      }

      // Autocomplete name field (available in both APIs)
      if (data && data.razon_social) {
        const clientNameInput = $("clientName");
        if (clientNameInput) {
          clientNameInput.value = data.razon_social || '';
          clientNameInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      // Address fields (only available in decolecta API)
      if (data && data.direccion) {
        const addressInput = $("clientAddress");
        if (addressInput) {
          let fullAddress = '';

          // Use the direccion field directly if it's not "-"
          if (data.direccion && data.direccion !== '-') {
            fullAddress = data.direccion;
          } else {
            // Build address from individual components
            const parts = [];

            if (data.via_tipo && data.via_tipo !== '-') parts.push(data.via_tipo);
            if (data.via_nombre && data.via_nombre !== '-') parts.push(data.via_nombre);
            if (data.numero && data.numero !== '-') parts.push('NRO. ' + data.numero);
            if (data.interior && data.interior !== '-') parts.push('INT. ' + data.interior);
            if (data.zona_tipo && data.zona_tipo !== '-') parts.push(data.zona_tipo);
            if (data.manzana && data.manzana !== '-') parts.push('MZ. ' + data.manzana);
            if (data.lote && data.lote !== '-') parts.push('LT. ' + data.lote);

            fullAddress = parts.join(' ');

            // If no address components, use distrito/provincia/departamento as fallback
            if (!fullAddress) {
              const locationParts = [];
              if (data.distrito && data.distrito !== '-') locationParts.push(data.distrito);
              if (data.provincia && data.provincia !== '-' && data.provincia !== data.distrito) {
                locationParts.push(data.provincia);
              }
              if (data.departamento && data.departamento !== '-' && data.departamento !== data.provincia) {
                locationParts.push(data.departamento);
              }
              fullAddress = locationParts.join(', ');
            }
          }

          addressInput.value = fullAddress;
          addressInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      // Department field (only available in decolecta API)
      if (data && data.departamento) {
        const deptInput = $("clientDepartment");
        if (deptInput) {
          deptInput.value = data.departamento || '';
          deptInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      // District field (only available in decolecta API)
      if (data && data.distrito) {
        const districtInput = $("clientDistrict");
        if (districtInput) {
          districtInput.value = data.distrito || '';
          districtInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      console.log('RUC data loaded successfully:', data.razon_social);
    } catch (error) {
      console.warn('Error fetching RUC data:', error.message);
      console.warn('You can still enter the data manually.');
      // Silently fail - user can still enter data manually
    }
  }

  function syncPreview() {
    // Meta
    setText("p_quoteNo", $("quoteNo").value);
    setText("p_quoteDate", $("quoteDate").value ? $("quoteDate").value.split("-").reverse().join("/") : "");

    // Cliente
    setText("p_clientName", $("clientName").value);
    setText("p_clientDoc", $("clientDoc").value);
    setText("p_clientAttn", $("clientAttn").value);
    setText("p_clientAddress", $("clientAddress").value);
    setText("p_clientDepartment", $("clientDepartment").value);
    setText("p_clientDistrict", $("clientDistrict").value);
    setText("p_currency", $("currency").value);

    // Condiciones
    setText("p_paymentTerms", $("paymentTerms").value);
    setText("p_delivery", $("delivery").value);



    // Items preview
    const pBody = $("p_itemsBody");
    pBody.innerHTML = "";
    if (state.items.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="8" style="color:#667085;font-size:12px;padding:12px 6px;">(Sin ítems)</td>`;
      pBody.appendChild(tr);
    } else {
      state.items.forEach((it, idx) => {
        const amount = toNumber(it.cant) * toNumber(it.priceIncIGV);
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="item-image-cell">
            ${it.image ?
            `<img src="${it.image}" alt="Ítem ${idx + 1}" class="preview-thumbnail" />` :
            `<span class="item-number">${idx + 1}</span>`
          }
          </td>
          <td>
            <div style="font-weight: 700;">${escapeHtml(it.desc || "")}</div>
            ${it.modelo || it.marca ? `
              <div style="font-size: 11px; color: #475467; margin-top: 2px;">
                ${it.modelo ? `<span>Mod: ${escapeHtml(it.modelo)}</span>` : ""}
                ${it.modelo && it.marca ? `<span style="margin: 0 4px;">|</span>` : ""}
                ${it.marca ? `<span>Marca: ${escapeHtml(it.marca)}</span>` : ""}
              </div>
            ` : ""}
          </td>
          <td class="right">${escapeHtml(it.cant)}</td>
          <td>${escapeHtml(it.unit || "")}</td>
          <td class="right">${fmtMoney(it.priceIncIGV)}</td>
          <td class="right">${fmtMoney(amount)}</td>
        `;
        pBody.appendChild(tr);
      });
    }

    // Totals
    const t = computeTotals();
    $("p_subtotal").textContent = fmtMoney(t.subtotal);
    $("p_tax_rate").textContent = $("taxRate").value;
    $("p_igv").textContent = fmtMoney(t.tax);
    $("p_total").textContent = fmtMoney(t.total);
  }

  function validateBeforeGenerate() {
    // Basic required fields
    const required = [
      { id: "quoteNo", label: "N° Cotización" },
      { id: "quoteDate", label: "Fecha" },
      { id: "clientName", label: "Cliente" }
    ];
    const missing = required.filter(r => !($(r.id).value || "").trim().length).map(r => r.label);
    if (missing.length) {
      alert("Completa los campos requeridos:\n- " + missing.join("\n- "));
      return false;
    }
    if (state.items.length === 0) {
      alert("Agrega al menos 1 ítem.");
      return false;
    }
    return true;
  }

  async function generatePDF() {
    if (!validateBeforeGenerate()) return;

    const btnGenerate = $("btnGenerate");
    const originalText = btnGenerate.textContent;

    try {
      // Show loading state
      btnGenerate.disabled = true;
      btnGenerate.textContent = "Generando PDF...";
      btnGenerate.style.opacity = "0.6";

      // Ensure preview is up-to-date
      syncPreview();

      const element = $("pdfRoot");
      const quoteNo = ($("quoteNo").value || "cotizacion").replace(/[^\w\-]+/g, "_");
      const filename = `${quoteNo}.pdf`;

      const opt = {
        margin: [8, 8, 8, 8], // mm
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      console.log("Generando PDF:", filename);

      // Generate PDF as blob (more reliable for downloads)
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

      // Create download link and trigger it
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Also open in new tab as fallback (in case download is blocked)
      setTimeout(() => {
        window.open(url, '_blank');
      }, 500);

      // Cleanup after a delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 3000);

      console.log("✓ PDF generado exitosamente:", filename);

      // Show success message with instructions
      btnGenerate.textContent = "✓ PDF Generado!";
      btnGenerate.style.background = "#10b981";

      // Show alert with instructions
      setTimeout(() => {
        alert(
          "✅ PDF generado exitosamente!\n\n" +
          "📁 Busca el archivo en tu carpeta de Descargas:\n" +
          filename + "\n\n" +
          "Si no aparece en Descargas:\n" +
          "• Revisa la barra inferior de Chrome\n" +
          "• O busca la pestaña nueva que se abrió con el PDF\n" +
          "• Haz clic derecho → 'Guardar como...'"
        );
      }, 1000);

      // Reset button after 3 seconds
      setTimeout(() => {
        btnGenerate.textContent = originalText;
        btnGenerate.style.background = "";
        btnGenerate.style.opacity = "";
        btnGenerate.disabled = false;
      }, 2000);

    } catch (err) {
      console.error("Error al generar PDF:", err);

      // Reset button
      btnGenerate.textContent = originalText;
      btnGenerate.style.opacity = "";
      btnGenerate.disabled = false;

      // Show detailed error
      alert(
        "❌ No se pudo generar el PDF.\n\n" +
        "Posibles causas:\n" +
        "• Asegúrate de estar usando http://127.0.0.1:8080 (NO file:///)\n" +
        "• Verifica que todos los campos estén completos\n" +
        "• Revisa la consola del navegador (F12) para más detalles\n\n" +
        "Error: " + err.message
      );
    }
  }

  function resetAll() {
    if (!confirm("¿Seguro que deseas limpiar todo?")) return;
    $("quoteForm").reset();
    $("quoteDate").value = todayISO();
    state.items = [];
    addItem({ desc: "", modelo: "", marca: "", cant: 1, priceIncIGV: 0, unit: "UND" });
    syncPreview();
  }

  function wire() {
    // Load companies first
    loadCompanies();

    // defaults
    $("quoteDate").value = todayISO();
    addItem({ desc: "", modelo: "", marca: "", cant: 1, priceIncIGV: 0, unit: "UND" });

    // Company selector
    const companySelect = $("companySelect");
    if (companySelect) {
      companySelect.addEventListener("change", (e) => {
        selectCompany(e.target.value);
      });
    }

    // form changes sync
    document.querySelectorAll("#quoteForm input, #quoteForm select, #quoteForm textarea")
      .forEach(el => el.addEventListener("input", syncPreview));

    // RUC autocomplete
    const rucInput = $("clientDoc");
    if (rucInput) {
      let rucTimeout;
      rucInput.addEventListener("input", (e) => {
        clearTimeout(rucTimeout);
        const ruc = e.target.value.trim();

        // Only trigger if it looks like a complete RUC (11 digits)
        if (ruc.length === 11 && /^\d{11}$/.test(ruc)) {
          rucTimeout = setTimeout(() => {
            fetchRUCData(ruc);
          }, 500); // Wait 500ms after user stops typing
        }
      });
    }

    $("btnAddItem").addEventListener("click", () => addItem());
    $("btnGenerate").addEventListener("click", generatePDF);
    $("btnReset").addEventListener("click", resetAll);

    syncPreview();
  }

  wire();
})();
