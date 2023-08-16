import './FaceRecognition.css'

const array_to_box_divs = (box, i) => {
    return (
        <div key={i} className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }} ></div>
    );
}

const FaceRecognition = ({ imageUrl, boxes }) => {

    const box_divs = boxes.map(array_to_box_divs);

    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
                {box_divs}
            </div>
        </div>
    );
}

export default FaceRecognition;