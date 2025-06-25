import { useState } from 'react';
import styles from '../styles/OrderForm.module.scss';

const OrderForm = () => {
    const [order, setOrder] = useState({
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            customer: {
                ...prevOrder.customer,
                [name]: value,
            },
        }));
    };

    const handleItemChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const { name, value } = e.target;
        const newItems = [...order.items];
        newItems[index] = { ...newItems[index], [name]: value };
        setOrder((prevOrder) => ({
            ...prevOrder,
            items: newItems,
        }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            poi_payment_settings: {
                ...prevOrder.poi_payment_settings,
                [name]: value === 'true',
            },
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            payment_setup: {
                ...prevOrder.payment_setup,
                [name]: value,
            },
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.images}>
                    <img src="/partner.svg" />
                    <img src="/blackbird.svg" />
                </div>
                <div className={styles.form}>
                    <h1 className={styles.title}>Create Order</h1>
                    <form>
                        <div className={styles.field}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Customer Name:"
                                value={order.customer.name}
                                onChange={handleCustomerChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Customer Email:"
                                value={order.customer.email}
                                onChange={handleCustomerChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Item Amount:"
                                value={order.items[0].amount}
                                onChange={(e) => handleItemChange(e, 0)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <input
                                type="text"
                                name="description"
                                placeholder="Item Description:"
                                value={order.items[0].description}
                                onChange={(e) => handleItemChange(e, 0)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Item Quantity:"
                                value={order.items[0].quantity}
                                onChange={(e) => handleItemChange(e, 0)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <input
                                type="text"
                                name="devices_serial_number"
                                placeholder="Device Serial Number:"
                                value={
                                    order.poi_payment_settings
                                        .devices_serial_number
                                }
                                onChange={handleChange}
                                className={styles.input}
                            />
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
                                            className={styles.radioInput}
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
                                            className={styles.radioInput}
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
                                            className={styles.radioInput}
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
                                            className={styles.radioInput}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Payment Type:
                            </label>
                            <select
                                name="type"
                                value={order.payment_setup.type}
                                onChange={handleSelectChange}
                                className={styles.select}
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
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
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
                            >
                                <option value="merchant">Merchant</option>
                                <option value="issuer">Issuer</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <input
                                type="text"
                                name="display_name"
                                placeholder="Display Name:"
                                value={order.display_name}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
