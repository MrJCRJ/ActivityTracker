document.getElementById('saveActivity').addEventListener('click', () => {
  const activityName = document.getElementById('activitySelect').value;
  const activityDate = document.getElementById('activityDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  if (!activityName || !activityDate || !startTime || !endTime) {
    alert('Preencha todos os campos!');
    return;
  }

  const activityLog = document.getElementById('activityLog');

  const listItem = document.createElement('li');
  listItem.textContent = `${activityName} - ${activityDate} | Início: ${startTime} | Fim: ${endTime}`;

  activityLog.appendChild(listItem);
});
