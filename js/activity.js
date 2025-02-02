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

  addActivityToDOM(newActivity);  // Adiciona a atividade ao DOM
  renderStatistics(activities);   // Atualiza as estatísticas após adicionar a atividade
}

function loadActivities() {
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data
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
  renderStatistics(activities); // Atualiza as estatísticas após excluir atividade
}

function filterActivities() {
  const filterText = document.getElementById('filterActivity').value.toLowerCase();
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  const filteredActivities = activities.filter(activity => {
    return activity.name.toLowerCase().includes(filterText) ||
      activity.date.includes(filterText);
  });

  // Atualiza o DOM com as atividades filtradas
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filterText)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });

  renderStatistics(filteredActivities); // Atualiza as estatísticas para as atividades filtradas
}
