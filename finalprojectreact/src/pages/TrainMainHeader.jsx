import "./TrainMainHeader.css";

const Header = ({title, leftChild, rightChild}) =>{
    return(
        <div className="TranHeaderMain">
            <div className="TranheaderMain_left">{leftChild}</div>
            <div className="TranheaderMain_title">{title}</div>
            <div className="TranheaderMain_right">{rightChild}</div>
        </div>
    );
}
export default Header;