// Fecha actual
document.getElementById('fecha').valueAsDate = new Date();




// Poner hora actual con AM/PM (formato 12h)
function setCurrentTime(inputId) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // convierte 0 a 12
  const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  document.getElementById(inputId).value = now.toTimeString().slice(0,5); // para el input type="time"
  // Opcional: mostrar con AM/PM en un span si quieres, pero el input ya lo maneja
}





// Placa en mayúsculas y limpia
document.getElementById('placa').addEventListener('input', function () {
  this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

// === CONTROL DE CAMPOS DINÁMICOS ===
document.getElementById('tipo').addEventListener('change', function () {
  const pintores    = document.getElementById('pintoresContainer');
  const lusitania   = document.getElementById('lusitaniaContainer');
  const cootrander  = document.getElementById('cootranderContainer');
  const flotax      = document.getElementById('flotaxContainer');  // ¡CORREGIDO!

  // Ocultar todos
  [pintores, lusitania, cootrander, flotax].forEach(el => {
    if (el) el.style.display = 'none';
  });

  // Quitar required
  ['nombrePintor', 'nombreLusitania', 'nombreCootrander', 'nombreFlotax'].forEach(id => {
    document.getElementById(id)?.removeAttribute('required');
  });

  // Mostrar el correcto
  if (this.value === 'Pintores y mecánicos') {
    pintores.style.display = 'block';
    document.getElementById('nombrePintor').setAttribute('required', 'required');
  }
  if (this.value === 'Lusitania') {
    lusitania.style.display = 'block';
    document.getElementById('nombreLusitania').setAttribute('required', 'required');
  }
  if (this.value === 'Cootrander') {
    cootrander.style.display = 'block';
    document.getElementById('nombreCootrander').setAttribute('required', 'required');
  }
  if (this.value === 'Flotax') {
    flotax.style.display = 'block';
    document.getElementById('nombreFlotax').setAttribute('required', 'required');
  }
});

// === AUTOCOMPLETAR PLACA ===
document.getElementById('nombreLusitania')?.addEventListener('change', function () {
  if (this.value.includes('|')) {
    const placa = this.value.split('|')[1].trim();
    if (placa) document.getElementById('placa').value = placa;
  }
});

document.getElementById('nombreCootrander')?.addEventListener('change', function () {
  if (this.value.includes('|')) {
    const placa = this.value.split('|')[1];
    if (placa) document.getElementById('placa').value = placa;
  }
});

document.getElementById('nombreFlotax')?.addEventListener('change', function () {
  if (this.value.includes('|')) {
    const placa = this.value.split('|')[1];
    if (placa) document.getElementById('placa').value = placa;
  }
});

// === GUARDAR + ABRIR TICKET ===
document.getElementById('entryForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const tipo = document.getElementById('tipo').value;
  let persona = 'No aplica';

  if (tipo === 'Pintores y mecánicos') {
    persona = document.getElementById('nombrePintor').value || 'No seleccionado';
  } else if (tipo === 'Lusitania') {
    persona = document.getElementById('nombreLusitania').value.split('|')[0];
  } else if (tipo === 'Cootrander') {
    persona = document.getElementById('nombreCootrander').value.split('|')[0];
  } else if (tipo === 'Flotax') {
    persona = document.getElementById('nombreFlotax').value.split('|')[0];
  }

  const registro = {
    fecha: document.getElementById('fecha').value,
    tipo: tipo,
    persona: persona,
    propietario: document.getElementById('propietario').value.trim() || 'No registrado',
    placa: document.getElementById('placa').value,
    asistencia: document.getElementById('asistencia').value,
    pago: document.getElementById('pago').value,
    horaEntrada: document.getElementById('horaEntrada').value || '--:--',
horaSalida: document.getElementById('horaSalida').value || '--:--',
    notas: document.getElementById('notas').value.trim(),
  };

  // Guardar
  let registros = JSON.parse(localStorage.getItem('parkRegistros') || '[]');
  registros.push({ ...registro, timestamp: new Date().toISOString() });
  localStorage.setItem('parkRegistros', JSON.stringify(registros));

  // Abrir ticket
  const params = new URLSearchParams({
    tipo: registro.tipo,
    placa: registro.placa,
    fecha: registro.fecha,
    horaEntrada: registro.horaEntrada,
    persona: registro.persona,
    propietario: registro.propietario,
    asistencia: registro.asistencia,
    pago: registro.pago,
    notas: registro.notas || 'Sin observaciones'
  });

  window.open('ticket.html?' + params.toString(), '_blank');

  // Resetear todo
  this.reset();
  document.getElementById('fecha').valueAsDate = new Date();
  document.querySelectorAll('[id$="Container"]').forEach(c => c.style.display = 'none');

  alert('Entrada registrada y ticket abierto para imprimir');
});

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.log('Error:', err));
}