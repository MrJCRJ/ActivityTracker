document.addEventListener('DOMContentLoaded', loadActivities);
document.getElementById('saveActivity').addEventListener('click', saveActivity);
document.getElementById('filterActivity').addEventListener('input', filterActivities);

function saveActivity() {
  const activityName = document.getElementById('activitySelect').value;
  const activityDate = document.getElementById('activityDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  if (!activityName || !activityDate || !startTime || !endTime) {
    alert('Preencha todos os campos!');
    return;
  }

  const newActivity = {
    id: Date.now(),
    name: activityName,
    date: activityDate,
    start: startTime,
    end: endTime
  };

  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.push(newActivity);
  localStorage.setItem('activities', JSON.stringify(activities));

  addActivityToDOM(newActivity);
  renderStatistics(); // Atualizar as estatísticas após adicionar atividade
}

function loadActivities() {
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data (do mais recente)
  activities.forEach(addActivityToDOM);
}

function addActivityToDOM(activity) {
  const activityLog = document.getElementById('activityLog');

  const listItem = document.createElement('li');
  listItem.classList.add('activity-item');
  listItem.innerHTML = `
    <strong>${activity.name}</strong> - ${activity.date} | Início: ${activity.start} | Fim: ${activity.end}
    <button class="delete-button">Excluir</button>
  `;

  const deleteButton = listItem.querySelector('.delete-button');
  deleteButton.addEventListener('click', () => deleteActivity(activity.id, listItem));

  activityLog.appendChild(listItem);
}

function deleteActivity(id, listItem) {
  let activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities = activities.filter(activity => activity.id !== id);
  localStorage.setItem('activities', JSON.stringify(activities));

  listItem.remove();
  renderStatistics(); // Atualizar as estatísticas após excluir atividade
}

function filterActivities() {
  const filterText = document.getElementById('filterActivity').value.toLowerCase();
  const activityItems = document.querySelectorAll('.activity-item');

  activityItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filterText)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

function renderStatistics() {
  const activities = JSON.parse(localStorage.getItem('activities')) || [];

  const totalActivities = activities.length;
  const totalHours = activities.reduce((sum, activity) => {
    const start = new Date(`${activity.date}T${activity.start}`);
    const end = new Date(`${activity.date}T${activity.end}`);
    const duration = (end - start) / 1000 / 60 / 60; // em horas
    return sum + duration;
  }, 0);

  const statsContainer = document.getElementById('statistics');
  statsContainer.innerHTML = `
    <h3>Estatísticas</h3>
    <p><strong>Total de Atividades:</strong> ${totalActivities}</p>
    <p><strong>Total de Horas Realizadas:</strong> ${totalHours.toFixed(2)} horas</p>
  `;
}
