// Elementos
const descInput = document.getElementById('desc');
const cantidadInput = document.getElementById('cantidad');
const tipoSelect = document.getElementById('tipo');
const agregarBtn = document.getElementById('agregarBtn');
const balanceSpan = document.getElementById('balance');
const historialList = document.getElementById('historialList');
const tipP = document.getElementById('tip');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');
const exportPDFBtn = document.getElementById('exportPDFBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

let historial = JSON.parse(localStorage.getItem('historial')) || [];

// Tips
const tips = [
    "Reduce tu café diario y ahorra $15 al mes ☕",
    "Lleva tu comida de casa y ahorra dinero 🍱",
    "Apaga luces innecesarias y ahorra en electricidad 💡",
    "Revisa tus suscripciones y elimina las que no uses 📱",
    "Compra productos de temporada para gastar menos 🛒"
];

// --- Funciones ---
function renderHistorial() {
    historialList.innerHTML = '';
    historial.forEach(item=>{
        const li = document.createElement('li');
        li.textContent = `${item.tipo.toUpperCase()}: ${item.desc} → $${item.cantidad.toFixed(2)}`;
        historialList.appendChild(li);
    });
}

function calcularBalance() {
    const balance = historial.reduce((acc,item)=>item.tipo==='ingreso'? acc+item.cantidad : acc-item.cantidad,0);
    balanceSpan.textContent = balance.toFixed(2);
    const balanceDiv = balanceSpan.parentElement;
    if(balance >= 0){ balanceDiv.classList.add('positivo'); balanceDiv.classList.remove('negativo'); }
    else { balanceDiv.classList.add('negativo'); balanceDiv.classList.remove('positivo'); }
}

function mostrarTip() {
    tipP.textContent = tips[Math.floor(Math.random()*tips.length)];
}

function actualizarGrafico(chart){
    const ingresos = historial.filter(i=>i.tipo==='ingreso').reduce((a,b)=>a+b.cantidad,0);
    const gastos = historial.filter(i=>i.tipo==='gasto').reduce((a,b)=>a+b.cantidad,0);
    chart.data.datasets[0].data = [ingresos,gastos];
    chart.update();
}

// --- Agregar registro ---
agregarBtn.addEventListener('click',()=>{
    const desc=descInput.value.trim();
    const cantidad=parseFloat(cantidadInput.value);
    const tipo=tipoSelect.value;
    if(desc===''||isNaN(cantidad)) return alert('Ingresa descripción y cantidad válida');

    historial.push({desc,cantidad,tipo});
    localStorage.setItem('historial',JSON.stringify(historial));
    descInput.value=''; cantidadInput.value='';
    renderHistorial(); calcularBalance(); mostrarTip(); actualizarGrafico(myChart);
});

// --- Resetear ---
resetBtn.addEventListener('click',()=>{
    if(confirm('¿Deseas eliminar todo el historial?')){
        historial=[]; localStorage.removeItem('historial');
        renderHistorial(); calcularBalance(); tipP.textContent="Agrega tu primer gasto o ingreso para ver tips.";
        actualizarGrafico(myChart);
    }
});

// --- Compartir tip ---
shareBtn.addEventListener('click',()=>{
    navigator.clipboard.writeText(tipP.textContent).then(()=>alert('Tip copiado! Comparte en tus redes'));
});

// --- Exportar PDF ---
exportPDFBtn.addEventListener('click',()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Historial de Ahorros 3.0",10,10);
    historial.forEach((h,i)=> doc.text(`${i+1}. ${h.tipo.toUpperCase()}: ${h.desc} → $${h.cantidad.toFixed(2)}`,10,20+i*10));
    doc.save("historial.pdf");
});

// --- Tema oscuro/claro ---
toggleThemeBtn.addEventListener('click',()=> document.body.classList.toggle('dark'));

// --- Inicializar ---
renderHistorial(); calcularBalance(); mostrarTip();

// --- Gráfico ---
const ctx=document.getElementById('chart').getContext('2d');
const myChart=new Chart(ctx,{ type:'bar', data:{ labels:['Ingresos','Gastos'], datasets:[{ label:'Balance', data:[0,0], backgroundColor:['#4ade80','#f87171'] }] }, options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } } });
actualizarGrafico(myChart);

