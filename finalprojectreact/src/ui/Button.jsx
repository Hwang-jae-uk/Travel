import "./Button.css";

const Button = ({text, type, onClick}) =>{
    const btnType = ["positive", "negative", "game"].includes(type) ? type : "default";
    return(
        // join(이어줄문자열) : 배열안에있는 데이터를 문자열을 이용하여 이어주는 함수
        // className="Button Button_default"
        <button 
            className={["Button", `Button_${btnType}`].join(" ")} 
            onClick={onClick}
        >{text}</button>
    );
}
// defaultProps : props로 type변수에 데이터가 없을 경우 기본값을 설정
Button.defaultProps = {type:"default"};
export default Button;