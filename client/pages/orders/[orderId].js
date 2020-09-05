import Router from "next/router";
import {
    useEffect,
    useState
} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequestHook from '../../hooks/use-request';

const OrderShow = ({
    order,
    currentUser
}) => {
    const {
        data: {
            expiresAt,
            ticket,
            id
        }
    } = order;

    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequestHook({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: id
        },
        onSuccess: (payment) => Router.push("/orders")
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId);
        }
    }, [order]);




    if (timeLeft < 0) {
        return <div > Order Expired < /div>
    }

    return <div > Time left to pay: {
        timeLeft
    }
    seconds
        <
        br / >
        <
        StripeCheckout
    token = {
        ({ id }) => doRequest({ token: id })
    }
    stripeKey = "pk_test_vwhO35gk9OrtDk0Cu1hkvslS00hfxCKzgT"
    amount = { ticket.price * 100 }
    email = { currentUser.email }
    />  {errors}   < /
    div >
}

OrderShow.getInitialProps = async(context, client) => {
    const {
        orderId
    } = context.query;
    const {
        data
    } = await client.get(`/api/orders/${orderId}`);
    //console.log(data)
    return {
        order: data
    }
}

// 4242 4242 4242 4242 mm/yy cvc

export default OrderShow;