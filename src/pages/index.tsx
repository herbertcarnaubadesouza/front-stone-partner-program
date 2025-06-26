import { useState } from "react";
import styles from "../styles/OrderForm.module.scss";
import {
  apiService,
  ActivateRequest,
  PayRequest,
  CancelRequest,
  PixPayRequest,
  PixStatusRequest,
  PixCancelRequest,
  PinpadSelectionRequest,
  PinpadMessageRequest,
  CardHolderDataRequest,
} from "../services/api";

type OperationType =
  | "activate"
  | "pay"
  | "cancel"
  | "pixPay"
  | "pixStatus"
  | "pixCancel"
  | "healthcheck"
  | "pinpadSelection"
  | "pinpadMessage"
  | "cardHolderData";
type FormStatus = "idle" | "loading" | "success" | "error";

interface ActivateForm extends ActivateRequest {}

interface PayForm extends PayRequest {}

interface CancelForm extends CancelRequest {}

interface PixPayForm extends PixPayRequest {}

interface PixStatusForm extends PixStatusRequest {}

interface PixCancelForm extends PixCancelRequest {}

interface PinpadSelectionForm extends PinpadSelectionRequest {}

interface PinpadMessageForm extends PinpadMessageRequest {}

interface CardHolderDataForm extends CardHolderDataRequest {}

interface FormErrors {
  [key: string]: string;
}

const PartnerProgramApp = () => {
  const [activeOperation, setActiveOperation] =
    useState<OperationType>("activate");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Activate form state
  const [activateForm, setActivateForm] = useState<ActivateForm>({
    stoneCode: "206192723",
    connectionName: "COM4",
    partnerName: "MAQUINA",
    urlNotification: "https://webhook8n.maistickets.com.br/webhook/hook-stone",
  });

  // Pay form state
  const [payForm, setPayForm] = useState<PayForm>({
    accountType: "credit",
    installment: {
      type: 1,
      number: 3,
    },
    hasAlcoholicDrink: false,
    amount: 100,
  });

  // Cancel form state
  const [cancelForm, setCancelForm] = useState<CancelForm>({
    acquirerTransactionKey: "codigo",
    amount: 100,
    transactionType: "credit_debit",
    panMask: "1234",
  });

  // PIX Pay form state
  const [pixPayForm, setPixPayForm] = useState<PixPayForm>({
    amount: 100,
    expiresIn: 600,
  });

  // PIX Status form state
  const [pixStatusForm, setPixStatusForm] = useState<PixStatusForm>({
    transactionId: "exemplo",
  });

  // PIX Cancel form state
  const [pixCancelForm, setPixCancelForm] = useState<PixCancelForm>({
    transactionId: "exemplo",
    amount: 100,
  });

  // PINPAD Selection form state
  const [pinpadSelectionForm, setPinpadSelectionForm] =
    useState<PinpadSelectionForm>({
      Options: ["Credito", "Debito", "Voucher"],
      Header: "Formas de pagamento",
    });

  // PINPAD Message form state
  const [pinpadMessageForm, setPinpadMessageForm] = useState<PinpadMessageForm>(
    {
      message: "exemplo mensagem",
      secondMessage: "exemplo mensagem 2",
      formatMessage: "center",
    }
  );

  // Card Holder Data form state
  const [cardHolderDataForm, setCardHolderDataForm] =
    useState<CardHolderDataForm>({
      id: "id",
    });

  const validateActivateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!activateForm.stoneCode.trim()) {
      newErrors.stoneCode = "Stone Code é obrigatório";
    }
    if (!activateForm.connectionName.trim()) {
      newErrors.connectionName = "Connection Name é obrigatório";
    }
    if (!activateForm.partnerName.trim()) {
      newErrors.partnerName = "Partner Name é obrigatório";
    }
    if (!activateForm.urlNotification.trim()) {
      newErrors.urlNotification = "URL Notification é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (payForm.amount <= 0) {
      newErrors.amount = "Amount deve ser maior que 0";
    }
    if (payForm.installment.number <= 0) {
      newErrors.installmentNumber = "Número de parcelas deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCancelForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!cancelForm.acquirerTransactionKey.trim()) {
      newErrors.acquirerTransactionKey =
        "Acquirer Transaction Key é obrigatório";
    }
    if (cancelForm.amount <= 0) {
      newErrors.amount = "Amount deve ser maior que 0";
    }
    if (!cancelForm.transactionType.trim()) {
      newErrors.transactionType = "Transaction Type é obrigatório";
    }
    if (!cancelForm.panMask.trim()) {
      newErrors.panMask = "Pan Mask é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePixPayForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (pixPayForm.amount <= 0) {
      newErrors.amount = "Amount deve ser maior que 0";
    }
    if (pixPayForm.expiresIn <= 0) {
      newErrors.expiresIn = "Expires In deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePixStatusForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!pixStatusForm.transactionId.trim()) {
      newErrors.transactionId = "Transaction ID é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePixCancelForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!pixCancelForm.transactionId.trim()) {
      newErrors.transactionId = "Transaction ID é obrigatório";
    }
    if (pixCancelForm.amount <= 0) {
      newErrors.amount = "Amount deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePinpadSelectionForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (pinpadSelectionForm.Options.length === 0) {
      newErrors.options = "Pelo menos uma opção é obrigatória";
    }
    if (!pinpadSelectionForm.Header.trim()) {
      newErrors.header = "Header é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePinpadMessageForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!pinpadMessageForm.message.trim()) {
      newErrors.message = "Mensagem é obrigatória";
    }
    if (!pinpadMessageForm.formatMessage.trim()) {
      newErrors.formatMessage = "Formato da mensagem é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCardHolderDataForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!cardHolderDataForm.id.trim()) {
      newErrors.id = "ID é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    let isValid = false;
    let response;

    try {
      switch (activeOperation) {
        case "activate":
          isValid = validateActivateForm();
          if (isValid) {
            response = await apiService.activate(activateForm);
          }
          break;
        case "pay":
          isValid = validatePayForm();
          if (isValid) {
            response = await apiService.pay(payForm);
          }
          break;
        case "cancel":
          isValid = validateCancelForm();
          if (isValid) {
            response = await apiService.cancel(cancelForm);
          }
          break;
        case "pixPay":
          isValid = validatePixPayForm();
          if (isValid) {
            response = await apiService.pixPay(pixPayForm);
          }
          break;
        case "pixStatus":
          isValid = validatePixStatusForm();
          if (isValid) {
            response = await apiService.pixStatus(pixStatusForm);
          }
          break;
        case "pixCancel":
          isValid = validatePixCancelForm();
          if (isValid) {
            response = await apiService.pixCancel(pixCancelForm);
          }
          break;
        case "healthcheck":
          isValid = true; // No validation needed for healthcheck
          response = await apiService.healthcheck();
          break;
        case "pinpadSelection":
          isValid = validatePinpadSelectionForm();
          if (isValid) {
            response = await apiService.pinpadSelection(pinpadSelectionForm);
          }
          break;
        case "pinpadMessage":
          isValid = validatePinpadMessageForm();
          if (isValid) {
            response = await apiService.pinpadMessage(pinpadMessageForm);
          }
          break;
        case "cardHolderData":
          isValid = validateCardHolderDataForm();
          if (isValid) {
            response = await apiService.getCardHolderData(cardHolderDataForm);
          }
          break;
      }

      if (!isValid) {
        setStatus("error");
        setErrorMessage("Por favor, corrija os erros no formulário");
        return;
      }

      if (response?.success) {
        setStatus("success");
        setSuccessMessage(`Operação ${activeOperation} realizada com sucesso!`);
        console.log("Response:", response.data);
      } else {
        setStatus("error");
        setErrorMessage(response?.error || "Erro desconhecido");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erro ao processar solicitação");
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  const renderActivateForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Ativação do Terminal</h2>

      <div className={styles.field}>
        <label className={styles.label}>Código Stone *</label>
        <input
          type="text"
          placeholder="Stone Code - Ex: 206192723 *"
          value={activateForm.stoneCode}
          onChange={(e) =>
            setActivateForm({ ...activateForm, stoneCode: e.target.value })
          }
          className={`${styles.input} ${
            errors.stoneCode ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.stoneCode && (
          <span className={styles.errorMessage}>{errors.stoneCode}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Nome da Conexão *</label>
        <input
          type="text"
          placeholder="Connection Name - Ex: COM4 *"
          value={activateForm.connectionName}
          onChange={(e) =>
            setActivateForm({ ...activateForm, connectionName: e.target.value })
          }
          className={`${styles.input} ${
            errors.connectionName ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.connectionName && (
          <span className={styles.errorMessage}>{errors.connectionName}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Nome do Parceiro *</label>
        <input
          type="text"
          placeholder="Partner Name - Ex: MAQUINA *"
          value={activateForm.partnerName}
          onChange={(e) =>
            setActivateForm({ ...activateForm, partnerName: e.target.value })
          }
          className={`${styles.input} ${
            errors.partnerName ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.partnerName && (
          <span className={styles.errorMessage}>{errors.partnerName}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>URL de Notificação *</label>
        <input
          type="url"
          placeholder="URL Notification - Ex: https://webhook.site/seu-webhook *"
          value={activateForm.urlNotification}
          onChange={(e) =>
            setActivateForm({
              ...activateForm,
              urlNotification: e.target.value,
            })
          }
          className={`${styles.input} ${
            errors.urlNotification ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.urlNotification && (
          <span className={styles.errorMessage}>{errors.urlNotification}</span>
        )}
      </div>
    </div>
  );

  const renderPayForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Cobrança</h2>

      <div className={styles.field}>
        <label className={styles.label}>Tipo de Conta:</label>
        <select
          value={payForm.accountType}
          onChange={(e) =>
            setPayForm({
              ...payForm,
              accountType: e.target.value as "credit" | "debit",
            })
          }
          className={styles.select}
          disabled={status === "loading"}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Valor da Transação *</label>
        <input
          type="number"
          placeholder="Valor em centavos - Ex: 100 (R$ 1,00) *"
          value={payForm.amount}
          onChange={(e) =>
            setPayForm({ ...payForm, amount: Number(e.target.value) })
          }
          className={`${styles.input} ${
            errors.amount ? styles.inputError : ""
          }`}
          min="0.01"
          step="0.01"
          disabled={status === "loading"}
        />
        {errors.amount && (
          <span className={styles.errorMessage}>{errors.amount}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tipo de Parcelamento *</label>
        <input
          type="number"
          placeholder="Tipo de Parcelamento - Ex: 1 *"
          value={payForm.installment.type}
          onChange={(e) =>
            setPayForm({
              ...payForm,
              installment: {
                ...payForm.installment,
                type: Number(e.target.value),
              },
            })
          }
          className={styles.input}
          min="1"
          disabled={status === "loading"}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Número de Parcelas *</label>
        <input
          type="number"
          placeholder="Número de Parcelas - Ex: 3 *"
          value={payForm.installment.number}
          onChange={(e) =>
            setPayForm({
              ...payForm,
              installment: {
                ...payForm.installment,
                number: Number(e.target.value),
              },
            })
          }
          className={`${styles.input} ${
            errors.installmentNumber ? styles.inputError : ""
          }`}
          min="1"
          disabled={status === "loading"}
        />
        {errors.installmentNumber && (
          <span className={styles.errorMessage}>
            {errors.installmentNumber}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Bebida Alcoólica:</label>
        <div className={styles.radioContainer}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="hasAlcoholicDrink"
                checked={payForm.hasAlcoholicDrink === true}
                onChange={() =>
                  setPayForm({ ...payForm, hasAlcoholicDrink: true })
                }
                disabled={status === "loading"}
              />
              Sim
            </label>
          </div>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="hasAlcoholicDrink"
                checked={payForm.hasAlcoholicDrink === false}
                onChange={() =>
                  setPayForm({ ...payForm, hasAlcoholicDrink: false })
                }
                disabled={status === "loading"}
              />
              Não
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCancelForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Cancelamento</h2>

      <div className={styles.field}>
        <label className={styles.label}>Chave da Transação *</label>
        <input
          type="text"
          placeholder="Acquirer Transaction Key - Ex: codigo *"
          value={cancelForm.acquirerTransactionKey}
          onChange={(e) =>
            setCancelForm({
              ...cancelForm,
              acquirerTransactionKey: e.target.value,
            })
          }
          className={`${styles.input} ${
            errors.acquirerTransactionKey ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.acquirerTransactionKey && (
          <span className={styles.errorMessage}>
            {errors.acquirerTransactionKey}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Valor do Cancelamento *</label>
        <input
          type="number"
          placeholder="Valor em centavos - Ex: 100 (R$ 1,00) *"
          value={cancelForm.amount}
          onChange={(e) =>
            setCancelForm({ ...cancelForm, amount: Number(e.target.value) })
          }
          className={`${styles.input} ${
            errors.amount ? styles.inputError : ""
          }`}
          min="0.01"
          step="0.01"
          disabled={status === "loading"}
        />
        {errors.amount && (
          <span className={styles.errorMessage}>{errors.amount}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tipo da Transação *</label>
        <input
          type="text"
          placeholder="Transaction Type - Ex: credit_debit *"
          value={cancelForm.transactionType}
          onChange={(e) =>
            setCancelForm({ ...cancelForm, transactionType: e.target.value })
          }
          className={`${styles.input} ${
            errors.transactionType ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.transactionType && (
          <span className={styles.errorMessage}>{errors.transactionType}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Máscara do Cartão *</label>
        <input
          type="text"
          placeholder="Pan Mask - Ex: 1234 *"
          value={cancelForm.panMask}
          onChange={(e) =>
            setCancelForm({ ...cancelForm, panMask: e.target.value })
          }
          className={`${styles.input} ${
            errors.panMask ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.panMask && (
          <span className={styles.errorMessage}>{errors.panMask}</span>
        )}
      </div>
    </div>
  );

  const renderPixPayForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Pagamento PIX</h2>

      <div className={styles.field}>
        <label className={styles.label}>Valor do PIX *</label>
        <input
          type="number"
          placeholder="Valor em centavos - Ex: 100 (R$ 1,00) *"
          value={pixPayForm.amount}
          onChange={(e) =>
            setPixPayForm({ ...pixPayForm, amount: Number(e.target.value) })
          }
          className={`${styles.input} ${
            errors.amount ? styles.inputError : ""
          }`}
          min="0.01"
          step="0.01"
          disabled={status === "loading"}
        />
        {errors.amount && (
          <span className={styles.errorMessage}>{errors.amount}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tempo de Expiração *</label>
        <input
          type="number"
          placeholder="Expira em segundos - Ex: 600 (10 min) *"
          value={pixPayForm.expiresIn}
          onChange={(e) =>
            setPixPayForm({ ...pixPayForm, expiresIn: Number(e.target.value) })
          }
          className={`${styles.input} ${
            errors.expiresIn ? styles.inputError : ""
          }`}
          min="1"
          disabled={status === "loading"}
        />
        {errors.expiresIn && (
          <span className={styles.errorMessage}>{errors.expiresIn}</span>
        )}
      </div>
    </div>
  );

  const renderPixStatusForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Status PIX</h2>

      <div className={styles.field}>
        <label className={styles.label}>ID da Transação PIX *</label>
        <input
          type="text"
          placeholder="Transaction ID - Ex: exemplo *"
          value={pixStatusForm.transactionId}
          onChange={(e) =>
            setPixStatusForm({
              ...pixStatusForm,
              transactionId: e.target.value,
            })
          }
          className={`${styles.input} ${
            errors.transactionId ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.transactionId && (
          <span className={styles.errorMessage}>{errors.transactionId}</span>
        )}
      </div>
    </div>
  );

  const renderPixCancelForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Cancelamento PIX</h2>

      <div className={styles.field}>
        <label className={styles.label}>ID da Transação PIX *</label>
        <input
          type="text"
          placeholder="Transaction ID - Ex: exemplo *"
          value={pixCancelForm.transactionId}
          onChange={(e) =>
            setPixCancelForm({
              ...pixCancelForm,
              transactionId: e.target.value,
            })
          }
          className={`${styles.input} ${
            errors.transactionId ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.transactionId && (
          <span className={styles.errorMessage}>{errors.transactionId}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Valor do Cancelamento PIX *</label>
        <input
          type="number"
          placeholder="Valor em centavos - Ex: 100 (R$ 1,00) *"
          value={pixCancelForm.amount}
          onChange={(e) =>
            setPixCancelForm({
              ...pixCancelForm,
              amount: Number(e.target.value),
            })
          }
          className={`${styles.input} ${
            errors.amount ? styles.inputError : ""
          }`}
          min="0.01"
          step="0.01"
          disabled={status === "loading"}
        />
        {errors.amount && (
          <span className={styles.errorMessage}>{errors.amount}</span>
        )}
      </div>
    </div>
  );

  const renderHealthcheckForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Verificar Conexão</h2>
      <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
        Esta operação verifica se a conexão com o terminal está funcionando.
        Clique no botão abaixo para executar o healthcheck.
      </p>
    </div>
  );

  const renderPinpadSelectionForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Menu PINPAD</h2>

      <div className={styles.field}>
        <label className={styles.label}>Título do Menu *</label>
        <input
          type="text"
          placeholder="Header - Ex: Formas de pagamento *"
          value={pinpadSelectionForm.Header}
          onChange={(e) =>
            setPinpadSelectionForm({
              ...pinpadSelectionForm,
              Header: e.target.value,
            })
          }
          className={`${styles.input} ${
            errors.header ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.header && (
          <span className={styles.errorMessage}>{errors.header}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Opções (separadas por vírgula):</label>
        <input
          type="text"
          placeholder="Ex: Credito,Debito,Voucher *"
          value={pinpadSelectionForm.Options.join(",")}
          onChange={(e) =>
            setPinpadSelectionForm({
              ...pinpadSelectionForm,
              Options: e.target.value
                .split(",")
                .map((option) => option.trim())
                .filter((option) => option.length > 0),
            })
          }
          className={`${styles.input} ${
            errors.options ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.options && (
          <span className={styles.errorMessage}>{errors.options}</span>
        )}
      </div>
    </div>
  );

  const renderPinpadMessageForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Mensagem PINPAD</h2>

      <div className={styles.field}>
        <label className={styles.label}>Mensagem Principal *</label>
        <input
          type="text"
          placeholder="Mensagem - Ex: exemplo mensagem *"
          value={pinpadMessageForm.message}
          onChange={(e) =>
            setPinpadMessageForm({
              ...pinpadMessageForm,
              message: e.target.value,
            })
          }
          className={`${styles.input} ${
            errors.message ? styles.inputError : ""
          }`}
          disabled={status === "loading"}
        />
        {errors.message && (
          <span className={styles.errorMessage}>{errors.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Segunda Mensagem (Opcional)</label>
        <input
          type="text"
          placeholder="Segunda Mensagem - Ex: exemplo mensagem 2"
          value={pinpadMessageForm.secondMessage}
          onChange={(e) =>
            setPinpadMessageForm({
              ...pinpadMessageForm,
              secondMessage: e.target.value,
            })
          }
          className={styles.input}
          disabled={status === "loading"}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Formato da Mensagem:</label>
        <select
          value={pinpadMessageForm.formatMessage}
          onChange={(e) =>
            setPinpadMessageForm({
              ...pinpadMessageForm,
              formatMessage: e.target.value,
            })
          }
          className={styles.select}
          disabled={status === "loading"}
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  const renderCardHolderDataForm = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Obter Dados do Portador</h2>

      <div className={styles.field}>
        <label className={styles.label}>ID do Portador *</label>
        <input
          type="text"
          placeholder="ID - Ex: id *"
          value={cardHolderDataForm.id}
          onChange={(e) =>
            setCardHolderDataForm({ ...cardHolderDataForm, id: e.target.value })
          }
          className={`${styles.input} ${errors.id ? styles.inputError : ""}`}
          disabled={status === "loading"}
        />
        {errors.id && <span className={styles.errorMessage}>{errors.id}</span>}
      </div>
    </div>
  );

  const getButtonText = () => {
    if (status === "loading") return "Processando...";
    if (status === "success") return "Sucesso!";
    if (status === "error") return "Erro - Tente Novamente";

    switch (activeOperation) {
      case "activate":
        return "Ativar Terminal";
      case "pay":
        return "Processar Cobrança";
      case "cancel":
        return "Cancelar Transação";
      case "pixPay":
        return "Gerar PIX";
      case "pixStatus":
        return "Consultar Status";
      case "pixCancel":
        return "Cancelar PIX";
      case "healthcheck":
        return "Verificar Conexão";
      case "pinpadSelection":
        return "Enviar Menu";
      case "pinpadMessage":
        return "Enviar Mensagem";
      case "cardHolderData":
        return "Obter Dados";
      default:
        return "Enviar";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.images}>
          <img src="/partner.svg" alt="Partner Logo" />
        </div>

        <div className={styles.form}>
          <h1 className={styles.title}>Stone Partner Program</h1>

          {/* Operation Tabs */}
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "activate" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("activate")}
              disabled={status === "loading"}
            >
              Ativação
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "pay" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("pay")}
              disabled={status === "loading"}
            >
              Cobrança
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "cancel" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("cancel")}
              disabled={status === "loading"}
            >
              Cancelamento
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "pixPay" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("pixPay")}
              disabled={status === "loading"}
            >
              PIX Pay
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "pixStatus" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("pixStatus")}
              disabled={status === "loading"}
            >
              PIX Status
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "pixCancel" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("pixCancel")}
              disabled={status === "loading"}
            >
              PIX Cancel
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "healthcheck" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("healthcheck")}
              disabled={status === "loading"}
            >
              Healthcheck
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "pinpadSelection" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("pinpadSelection")}
              disabled={status === "loading"}
            >
              Menu PINPAD
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "pinpadMessage" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("pinpadMessage")}
              disabled={status === "loading"}
            >
              MSG PINPAD
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeOperation === "cardHolderData" ? styles.active : ""
              }`}
              onClick={() => setActiveOperation("cardHolderData")}
              disabled={status === "loading"}
            >
              Card Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {activeOperation === "activate" && renderActivateForm()}
            {activeOperation === "pay" && renderPayForm()}
            {activeOperation === "cancel" && renderCancelForm()}
            {activeOperation === "pixPay" && renderPixPayForm()}
            {activeOperation === "pixStatus" && renderPixStatusForm()}
            {activeOperation === "pixCancel" && renderPixCancelForm()}
            {activeOperation === "healthcheck" && renderHealthcheckForm()}
            {activeOperation === "pinpadSelection" &&
              renderPinpadSelectionForm()}
            {activeOperation === "pinpadMessage" && renderPinpadMessageForm()}
            {activeOperation === "cardHolderData" && renderCardHolderDataForm()}

            {/* Success/Error Messages */}
            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            <button
              type="submit"
              className={`${styles.submitButton} ${styles[status]}`}
              disabled={status === "loading"}
            >
              {status === "loading" && <div className={styles.spinner}></div>}
              {getButtonText()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerProgramApp;
