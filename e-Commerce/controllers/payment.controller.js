import Payment from '../models/payment.model.js';
import fetch from 'node-fetch';
import { get_ip } from 'ipware';


export const createPayment = async (req, res) => {
    try {
        const { reference, user, checkout, totalAmount, paymentMethod, currency } = req.body;

        // Required fields
        if (!reference || !user || !totalAmount) {
            return res.status(400).json({ message: "Reference, user, and totalAmount are required." });
        }

        // Get client Live IP
        // const ipInfo = get_ip()(req);
        // const clientIp = ipInfo.clientIp;

        //Get Testing IP
          // Get IP
        let { clientIp } = get_ip()(req);
        if (clientIp === '::1' || clientIp === '127.0.0.1') {
            clientIp = '102.89.0.1'; // Nigerian IP for local testing
        }

        if (!clientIp) {
            return res.status(400).json({ message: "IP address is required." });
        }

        // Get geo data for IP
        const geoData = await fetch(`https://ipapi.co/${clientIp}/json/`)
            .then(response => response.json());

        // Currency-based country check
        if (currency === 'NGN' && geoData.country_name !== 'Nigeria') {
            return res.status(400).json({ message: "Nigerian IP address is required for NGN payments." });
        }
        // if (currency === 'USD' && geoData.country_name !== 'United States') {
        //     return res.status(400).json({ message: "US IP address is required for USD payments." });
        // }

        // Create payment
        const newPayment = new Payment({
            reference,
            user,
            checkout,
            totalAmount,
            paymentMethod: paymentMethod || 'paystack',
            currency,
            ipAddress: clientIp,
            country: geoData.country_name || 'Unknown',
        });

        const savedPayment = await newPayment.save();
        return res.status(201).json(savedPayment);

    } catch (error) {
        return res.status(500).json({ message: "Error creating payment", error: error.message });
    }
};

export const getPayment = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Payment ID is required" });
        }

        const payment = await Payment
            .findById(req.params.id)
            .populate("checkout")
            .populate("order")
            .populate("user");

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        return res.status(200).json(payment);

    } catch (error) {
        return res.status(500).json({ message: "Error retrieving payment", error: error.message });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const allPayments = await Payment
            .find()
            .populate("checkout")
            .populate("order")
            .populate("user");

        return res.status(200).json(allPayments);

    } catch (error) {
        return res.status(500).json({ message: "Error getting payments", error: error.message });
    }
};
