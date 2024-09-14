/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element.
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents().
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) throw new Error('Передан пустой элемент!');
    
    this.element = element;

    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта.
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const createAccountButton = e.target.closest('.create-account');
      const account = e.target.closest('.account');

      if (createAccountButton) {
        const createAccountModal = App.getModal('createAccount');
        createAccountModal.open();
      } else if (account) {
        this.onSelectAccount(account);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (!User.current()) return;

    Account.list(null, (err, response) => {
      if (response.success) {
        this.clear();
        const arrOfAccountsInResponse = [...response.data];
        arrOfAccountsInResponse.forEach(account => this.renderItem(account));
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const arrOfAccounts = [...document.querySelectorAll('.account')];
    arrOfAccounts.forEach(account => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта.
   * Устанавливает текущему выбранному элементу счёта
   * класс .active Удаляет ранее выбранному элементу
   * счёта класс .active
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccount = document.querySelector('.active.account');
    if (activeAccount) activeAccount.classList.remove('active');

    element.classList.add('active');
    App.showPage('transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const accountHTML = `
      <li class="account" data-id="${item.id}">
        <a href="#">
          <span>${item.name}</span> / <span>${item.sum} ₽</span>
        </a>
      </li>`;

    return accountHTML;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    this.element.innerHTML += this.getAccountHTML(data);
  }
}