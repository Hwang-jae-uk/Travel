// 새 Express 서버 생성 및 PortOne 결제 검증 라우터 구성
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { PortOne } from '@portone/server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PortOne SDK 초기화
const portone = new PortOne({
  apiKey: process.env.PORTONE_API_KEY,
  apiSecret: process.env.PORTONE_API_SECRET,
});

// 결제 검증 엔드포인트
app.post('/api/pay/verify', async (req, res) => {
  const { imp_uid, amount } = req.body;
  try {
    const { response: payment } = await portone.payments.getPaymentByImpUid({ imp_uid });

    // 결제 상태 및 금액 확인
    if (payment.status === 'paid' && Number(payment.amount) === Number(amount)) {
      // TODO: DB 처리, 티켓 확정 등 비즈니스 로직
      return res.json({ success: true });
    }
    return res.status(400).json({ success: false, message: '결제 정보 불일치' });
  } catch (error) {
    console.error('PortOne 검증 오류', error);
    res.status(500).json({ success: false, message: '검증 실패' });
  }
});

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Payment server listening on port ${PORT}`);
}); 