'use client';
import '@/styles/app.css';
import './trypro.scss';
import { Button, Container, Grid, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useEffect, useRef, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

interface Iprops {
    userVip: IUserVip;
}

const TryPro = ({ userVip }: Iprops) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [service, setService] = useState('service1');
    const [method, setMethod] = useState('paypal');
    const [sdkReady, setSdkReady] = useState(false);
    const checkoutRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const handleChangePackage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setService((event.target as HTMLInputElement).value);
    };

    const handleChangeMethod = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMethod((event.target as HTMLInputElement).value);
    };

    const onSuccessPaypal = async (details: any, data: any) => {
        console.log('details, data: ', details, data);
        if (details && data) {
            const res = await sendRequest<IBackendRes<IUserVip>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users-vip`,
                method: 'POST',
                body: {
                    id: session?.user.id,
                    status: false,
                    email: session?.user.email,
                },
            });
            if (res.data) {
                toast.success(res.message);
                router.push('/discover');
            }
        }
    };

    const addPaypalScript = async () => {
        console.log('okee');
        const data =
            'AcpReoXUBlJ5t5kU0AqikyHg7HX4GwyoPOySpR_jm15sFkgpIMXdfWQNGNl0qj9-XbZIn6vv55GiRvIc';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=AcpReoXUBlJ5t5kU0AqikyHg7HX4GwyoPOySpR_jm15sFkgpIMXdfWQNGNl0qj9-XbZIn6vv55GiRvIc`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }
    }, []);

    return (
        <div>
            <div className="container">
                <div className="headline-container">
                    <div className="logo">
                        <img src="logo_Music-Cloud.png" alt="" height={88} />
                    </div>
                    <h1 className="text-large">Nhận Next Pro cho ₫1,140,000/năm</h1>
                    <h2 className="text-medium">
                        Khai phá sức mạnh MusicCloud của chúng tôi dành cho nghệ sĩ.
                    </h2>
                    <h3 className="text-small">
                        * Ưu đãi chỉ áp dụng cho năm đăng ký đầu tiên.
                    </h3>
                    <Button
                        className="button"
                        variant="contained"
                        size="small"
                        onClick={() =>
                            checkoutRef.current!.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            })
                        }
                    >
                        Bắt đầu ngay
                    </Button>
                </div>
                <Container>
                    <div className="checkout" ref={checkoutRef}>
                        <h1 className="checkout-title">Get Next Pro</h1>
                        <FormControl>
                            <Grid container spacing={5} columns={12}>
                                <Grid item sm={12} md={6}>
                                    <div className="input-column">
                                        <div className="checkout-section">
                                            <h2>1. Chọn gói thanh toán</h2>
                                            <RadioGroup
                                                name="package service"
                                                value={service}
                                                onChange={handleChangePackage}
                                            >
                                                <FormControlLabel
                                                    className="option-value"
                                                    value="service1"
                                                    control={<Radio />}
                                                    label={
                                                        <>
                                                            <h3> Gói Pro 1 </h3>
                                                            <span>Phí ₫1,140,000</span>
                                                        </>
                                                    }
                                                />
                                                <FormControlLabel
                                                    className="option-value"
                                                    value="service2"
                                                    control={<Radio />}
                                                    label={
                                                        <>
                                                            <h3> Gói Pro 2 </h3>
                                                            <span>Phí ₫2,140,000</span>
                                                        </>
                                                    }
                                                    disabled
                                                />
                                            </RadioGroup>
                                        </div>
                                        <div className="checkout-section">
                                            <h2>2. Chọn phương thức thanh toán</h2>
                                            <RadioGroup
                                                name="method payment"
                                                value={method}
                                                onChange={handleChangeMethod}
                                            >
                                                <FormControlLabel
                                                    className="option-value"
                                                    value="paypal"
                                                    control={<Radio />}
                                                    label="PayPal"
                                                />
                                                <FormControlLabel
                                                    className="option-value"
                                                    value="card"
                                                    control={<Radio />}
                                                    label="Card"
                                                    disabled
                                                />
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <div className="review-column">
                                        <h2>3. Xem lại giao dịch mua hàng của bạn</h2>
                                        <div className="selected-plan">
                                            <img
                                                src="/user/default-google.png"
                                                alt=""
                                                height={48}
                                                width={48}
                                            />
                                            <span>Next Pro</span>
                                        </div>
                                        <div className="review-container">
                                            <div className="total-container">
                                                <h3>Tổng tiền</h3>
                                                <span>₫1,140,000</span>
                                            </div>
                                            <div className="service-container">
                                                <h3>Gói Pro</h3>
                                                <span>1</span>
                                            </div>
                                            <div className="renowa-info">
                                                Đăng ký sẽ tự động gia hạn ở mức
                                                ₫1.650.000 mỗi năm, trừ khi bạn hủy trước
                                                ngày gia hạn tiếp theo trong cài đặt đăng
                                                ký của mình
                                            </div>
                                            <div className="caption">
                                                Tất cả giá bằng VNĐ
                                            </div>
                                        </div>
                                        {userVip ? (
                                            <Button
                                                className="button"
                                                variant="contained"
                                                size="small"
                                                style={{
                                                    marginLeft: '8px',
                                                    padding: '10px 18px',
                                                    color: 'red',
                                                    textTransform: 'unset',
                                                    fontSize: '16px',
                                                }}
                                                disabled
                                                fullWidth
                                            >
                                                Bạn đã đăng kí trở thành một thành viên
                                                VIP
                                            </Button>
                                        ) : (
                                            <div className="button-checkout">
                                                <PayPalButton
                                                    amount={Math.floor(1140000 / 24000)}
                                                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                    onSuccess={onSuccessPaypal}
                                                    onError={() => {
                                                        alert('Erroe');
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </FormControl>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default TryPro;
