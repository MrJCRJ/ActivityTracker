document.addEventListener('DOMContentLoaded', loadActivities);
document.getElementById('saveActivity').addEventListener('click', saveActivity);

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
    id: Date.now(), // Cria um ID único
    name: activityName,
    date: activityDate,
    start: startTime,
    end: endTime
  };

  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.push(newActivity);
  localStorage.setItem('activities', JSON.stringify(activities));

  addActivityToDOM(newActivity);
}

function loadActivities() {
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.forEach(addActivityToDOM);
}

function addActivityToDOM(activity) {
  const activityLog = document.getElementById('activityLog');

  const listItem = document.createElement('li');
  listItem.textContent = `${activity.name} - ${activity.date} | Início: ${activity.start} | Fim: ${activity.end}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.addEventListener('click', () => deleteActivity(activity.id, listItem));

  listItem.appendChild(deleteButton);
  activityLog.appendChild(listItem);
}

function deleteActivity(id, listItem) {
  let activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities = activities.filter(activity => activity.id !== id);
  localStorage.setItem('activities', JSON.stringify(activities));

  listItem.remove(); // Remove do HTML
}
