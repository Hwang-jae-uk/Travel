import TrainMainHeader from "./TrainMainHeader";
import Button from "../ui/Button"; 
import HomePage from "./HomePage";
import { useNavigate } from "react-router-dom";
import "./TrainHome.css";
import { TbTrain } from "react-icons/tb";
import { BsCart4 } from "react-icons/bs";

const TrainHome = () => {
  const headerTitle = <TbTrain className="TrainHome-icon"/>;
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용
 
  return (
    <div className="train-home">
        {/* 상단 헤더 */}
        <TrainMainHeader
            title={headerTitle}
            leftChild={<Button text={"◀"} onClick={() => navigate('/')}/>}
            rightChild={<Button text={<BsCart4/>} onClick={() => navigate('/TrainBasket')} className="TrainCart-icon"/>}
        />  
        <HomePage/>
    </div>
  );
};

export default TrainHome;