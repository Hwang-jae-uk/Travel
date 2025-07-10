import React from 'react';
import "./HotelHeader.css";

const HotelHeader = ({ title, leftChild, rightChild }) => {
    return (
        <div className="hotel-header">
            <div className="hotel-header-left">
                {leftChild}
            </div>
            <div className="hotel-header-center">
                <h1>{title}</h1>
            </div>
            <div className="hotel-header-right">
                {rightChild}
            </div>
        </div>
    );
};

export default HotelHeader;