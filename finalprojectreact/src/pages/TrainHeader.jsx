import "./TrainHeader.css";

const Header = ({title, leftChild, rightChild}) =>{
    return(
        <div className="TranHeader">
            <div className="Tranheader_left">{leftChild}</div>
            <div className="Tranheader_title">{title}</div>
            <div className="Tranheader_right">{rightChild}</div>
        </div>
    );
}
export default Header;