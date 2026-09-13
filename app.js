const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('username').innerText = user.first_name;
}

document.getElementById('mainButton').addEventListener('click', () => {
    document.getElementById('status').innerText = 'Ты нажал кнопку! 🎉';
    tg.sendData(JSON.stringify({ action: 'button_clicked', timestamp: Date.now() }));
});
