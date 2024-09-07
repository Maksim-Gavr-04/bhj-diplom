/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */

class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list.
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, response) => {
      if (response.success) {
        const arrOfAccountObjects = [...response.data];

        const incomeAccountsList = document.getElementById('income-accounts-list');
        incomeAccountsList.innerHTML = '';
        const expenseAccountsList = document.getElementById('expense-accounts-list');
        expenseAccountsList.innerHTML = '';
        
        arrOfAccountObjects.forEach(object => {
          incomeAccountsList.innerHTML += `<option value="${object.id}">${object.name}</option>`;
          expenseAccountsList.innerHTML += `<option value="${object.id}">${object.name}</option>`;
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        this.element.reset();
        const incomeModal = App.getModal('newIncome');
        incomeModal.close();

        const expenseModal = App.getModal('newExpense');
        expenseModal.close();
        App.update();
      }
    });
  }
}