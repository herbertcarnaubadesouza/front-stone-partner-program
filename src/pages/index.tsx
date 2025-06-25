import { useState } from 'react';
import styles from '../styles/OrderForm.module.scss';

interface Customer {
    name: string;
    email: string;
}

interface Item {
    amount: string;
    description: string;
    quantity: string;
}

interface PoiPaymentSettings {
    visible: boolean;
    print_order_receipt: boolean;
    devices_serial_number: string;
}

interface PaymentSetup {
    type: 'credit' | 'debit' | 'voucher';
    installments: number;
    installment_type: 'merchant' | 'issuer';
}

interface Order {
    customer: Customer;
    items: Item[];
    closed: boolean;
    poi_payment_settings: PoiPaymentSettings;
    payment_setup: PaymentSetup;
    display_name: string;
}

interface FormErrors {
    customer?: {
        name?: string;
        email?: string;
    };
    items?: {
        amount?: string;
        description?: string;
        quantity?: string;
    };
    devices_serial_number?: string;
    display_name?: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const OrderForm = () => {
    const [order, setOrder] = useState<Order>({
        customer: {
            name: '',
            email: '',
        },
        items: [
            {
                amount: '',
                description: '',
                quantity: '',
            },
        ],
        closed: false,
        poi_payment_settings: {
            visible: true,
            print_order_receipt: false,
            devices_serial_number: '',
        },
        payment_setup: {
            type: 'credit',
            installments: 1,
            installment_type: 'merchant',
        },
        display_name: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<FormStatus>('idle');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate customer
        if (!order.customer.name.trim()) {
            newErrors.customer = {
                ...newErrors.customer,
                name: 'Name is required',
            };
        }

        if (!order.customer.email.trim()) {
            newErrors.customer = {
                ...newErrors.customer,
                email: 'Email is required',
            };
        } else if (!/\S+@\S+\.\S+/.test(order.customer.email)) {
            newErrors.customer = {
                ...newErrors.customer,
                email: 'Email is invalid',
            };
        }

        // Validate items
        if (!order.items[0].amount.trim()) {
            newErrors.items = {
                ...newErrors.items,
                amount: 'Amount is required',
            };
        } else if (Number(order.items[0].amount) <= 0) {
            newErrors.items = {
                ...newErrors.items,
                amount: 'Amount must be greater than 0',
            };
        }

        if (!order.items[0].description.trim()) {
            newErrors.items = {
                ...newErrors.items,
                description: 'Description is required',
            };
        }

        if (!order.items[0].quantity.trim()) {
            newErrors.items = {
                ...newErrors.items,
                quantity: 'Quantity is required',
            };
        } else if (Number(order.items[0].quantity) <= 0) {
            newErrors.items = {
                ...newErrors.items,
                quantity: 'Quantity must be greater than 0',
            };
        }

        // Validate device serial number
        if (!order.poi_payment_settings.devices_serial_number.trim()) {
            newErrors.devices_serial_number =
                'Device serial number is required';
        }

        // Validate display name
        if (!order.display_name.trim()) {
            newErrors.display_name = 'Display name is required';
        }

        setErrors(newErrors);
        return (
            Object.keys(newErrors).length === 0 &&
            (!newErrors.customer ||
                Object.keys(newErrors.customer).length === 0) &&
            (!newErrors.items || Object.keys(newErrors.items).length === 0)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus('loading');

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Order submitted:', order);
            setStatus('success');

            // Reset form after success
            setTimeout(() => {
                setStatus('idle');
                setOrder({
                    customer: { name: '', email: '' },
                    items: [{ amount: '', description: '', quantity: '' }],
                    closed: false,
                    poi_payment_settings: {
                        visible: true,
                        print_order_receipt: false,
                        devices_serial_number: '',
                    },
                    payment_setup: {
                        type: 'credit',
                        installments: 1,
                        installment_type: 'merchant',
                    },
                    display_name: '',
                });
                setErrors({});
            }, 3000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Clear specific error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }

        setOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Clear customer errors when user starts typing
        if (errors.customer?.[name as keyof Customer]) {
            setErrors((prev) => ({
                ...prev,
                customer: { ...prev.customer, [name]: undefined },
            }));
        }

        setOrder((prev) => ({
            ...prev,
            customer: { ...prev.customer, [name]: value },
        }));
    };

    const handleItemChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const { name, value } = e.target;

        // Clear item errors when user starts typing
        if (errors.items?.[name as keyof Item]) {
            setErrors((prev) => ({
                ...prev,
                items: { ...prev.items, [name]: undefined },
            }));
        }

        const newItems = [...order.items];
        newItems[index] = { ...newItems[index], [name]: value };
        setOrder((prev) => ({ ...prev, items: newItems }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrder((prev) => ({
            ...prev,
            poi_payment_settings: {
                ...prev.poi_payment_settings,
                [name]: value === 'true',
            },
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder((prev) => ({
            ...prev,
            payment_setup: {
                ...prev.payment_setup,
                [name]: name === 'installments' ? Number(value) : value,
            },
        }));
    };

    const getButtonText = () => {
        switch (status) {
            case 'loading':
                return 'Processing...';
            case 'success':
                return 'Order Created Successfully!';
            case 'error':
                return 'Failed to Create Order';
            default:
                return 'Create Order';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.images}>
                    <img src="/partner.svg" alt="Partner Logo" />
                    {/* <img src="/blackbird.svg" alt="Blackbird Logo" />s */}
                </div>

                <div className={styles.form}>
                    <h1 className={styles.title}>Create Order</h1>

                    <form
                        onSubmit={handleSubmit}
                        className={styles.formContainer}
                    >
                        {/* Customer Information Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Customer Information
                            </h2>

                            <div className={styles.field}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Customer Name *"
                                    value={order.customer.name}
                                    onChange={handleCustomerChange}
                                    className={`${styles.input} ${
                                        errors.customer?.name
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    disabled={status === 'loading'}
                                />
                                {errors.customer?.name && (
                                    <span className={styles.errorMessage}>
                                        {errors.customer.name}
                                    </span>
                                )}
                            </div>

                            <div className={styles.field}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Customer Email *"
                                    value={order.customer.email}
                                    onChange={handleCustomerChange}
                                    className={`${styles.input} ${
                                        errors.customer?.email
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    disabled={status === 'loading'}
                                />
                                {errors.customer?.email && (
                                    <span className={styles.errorMessage}>
                                        {errors.customer.email}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Item Information Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Item Information
                            </h2>

                            <div className={styles.field}>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Item Amount (R$) *"
                                    value={order.items[0].amount}
                                    onChange={(e) => handleItemChange(e, 0)}
                                    className={`${styles.input} ${
                                        errors.items?.amount
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    min="0"
                                    step="0.01"
                                    disabled={status === 'loading'}
                                />
                                {errors.items?.amount && (
                                    <span className={styles.errorMessage}>
                                        {errors.items.amount}
                                    </span>
                                )}
                            </div>

                            <div className={styles.field}>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Item Description *"
                                    value={order.items[0].description}
                                    onChange={(e) => handleItemChange(e, 0)}
                                    className={`${styles.input} ${
                                        errors.items?.description
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    disabled={status === 'loading'}
                                />
                                {errors.items?.description && (
                                    <span className={styles.errorMessage}>
                                        {errors.items.description}
                                    </span>
                                )}
                            </div>

                            <div className={styles.field}>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Item Quantity *"
                                    value={order.items[0].quantity}
                                    onChange={(e) => handleItemChange(e, 0)}
                                    className={`${styles.input} ${
                                        errors.items?.quantity
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    min="1"
                                    disabled={status === 'loading'}
                                />
                                {errors.items?.quantity && (
                                    <span className={styles.errorMessage}>
                                        {errors.items.quantity}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Device Settings Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Device Settings
                            </h2>

                            <div className={styles.field}>
                                <input
                                    type="text"
                                    name="devices_serial_number"
                                    placeholder="Device Serial Number *"
                                    value={
                                        order.poi_payment_settings
                                            .devices_serial_number
                                    }
                                    onChange={handleInputChange}
                                    className={`${styles.input} ${
                                        errors.devices_serial_number
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    disabled={status === 'loading'}
                                />
                                {errors.devices_serial_number && (
                                    <span className={styles.errorMessage}>
                                        {errors.devices_serial_number}
                                    </span>
                                )}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Print Order Receipt:
                                </label>
                                <div className={styles.radioContainer}>
                                    <div className={styles.radioGroup}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="print_order_receipt"
                                                value="true"
                                                checked={
                                                    order.poi_payment_settings
                                                        .print_order_receipt ===
                                                    true
                                                }
                                                onChange={handleRadioChange}
                                                disabled={status === 'loading'}
                                            />
                                            Yes
                                        </label>
                                    </div>
                                    <div className={styles.radioGroup}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="print_order_receipt"
                                                value="false"
                                                checked={
                                                    order.poi_payment_settings
                                                        .print_order_receipt ===
                                                    false
                                                }
                                                onChange={handleRadioChange}
                                                disabled={status === 'loading'}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Visible:</label>
                                <div className={styles.radioContainer}>
                                    <div className={styles.radioGroup}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="visible"
                                                value="true"
                                                checked={
                                                    order.poi_payment_settings
                                                        .visible === true
                                                }
                                                onChange={handleRadioChange}
                                                disabled={status === 'loading'}
                                            />
                                            Yes
                                        </label>
                                    </div>
                                    <div className={styles.radioGroup}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="visible"
                                                value="false"
                                                checked={
                                                    order.poi_payment_settings
                                                        .visible === false
                                                }
                                                onChange={handleRadioChange}
                                                disabled={status === 'loading'}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Settings Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Payment Settings
                            </h2>

                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Payment Type:
                                </label>
                                <select
                                    name="type"
                                    value={order.payment_setup.type}
                                    onChange={handleSelectChange}
                                    className={styles.select}
                                    disabled={status === 'loading'}
                                >
                                    <option value="credit">Credit</option>
                                    <option value="debit">Debit</option>
                                    <option value="voucher">Voucher</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Installments:
                                </label>
                                <select
                                    name="installments"
                                    value={order.payment_setup.installments}
                                    onChange={handleSelectChange}
                                    className={styles.select}
                                    disabled={status === 'loading'}
                                >
                                    <option value="1">1x</option>
                                    <option value="2">2x</option>
                                    <option value="3">3x</option>
                                    <option value="4">4x</option>
                                    <option value="5">5x</option>
                                    <option value="6">6x</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Installment Type:
                                </label>
                                <select
                                    name="installment_type"
                                    value={order.payment_setup.installment_type}
                                    onChange={handleSelectChange}
                                    className={styles.select}
                                    disabled={status === 'loading'}
                                >
                                    <option value="merchant">Merchant</option>
                                    <option value="issuer">Issuer</option>
                                </select>
                            </div>
                        </div>

                        {/* Display Settings Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Display Settings
                            </h2>

                            <div className={styles.field}>
                                <input
                                    type="text"
                                    name="display_name"
                                    placeholder="Display Name *"
                                    value={order.display_name}
                                    onChange={handleInputChange}
                                    className={`${styles.input} ${
                                        errors.display_name
                                            ? styles.inputError
                                            : ''
                                    }`}
                                    disabled={status === 'loading'}
                                />
                                {errors.display_name && (
                                    <span className={styles.errorMessage}>
                                        {errors.display_name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`${styles.submitButton} ${styles[status]}`}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' && (
                                <div className={styles.spinner}></div>
                            )}
                            {getButtonText()}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
