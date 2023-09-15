import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Wheel } from "react-custom-roulette";
import Logo from "./edcanlogo.svg";

const Roulette = () => {
    const [inputList, setInputList] = useState([
        {
            id: 1,
            desc: "G102 마우스",
            prize: 1,
            text: '1등'
        },
        {
            id: 2,
            desc: "소형 아크릴 스탠드",
            prize: 1,
            text: '2등'
        },
        {
            id: 3,
            desc: "키링",
            prize: 1,
            text: '3등'
        },
        {
            id: 4,
            desc: "안경닦이 or 마우스패드",
            prize: 1,
            text: '4등'
        },
        {
            id: 5,
            desc: "약과",
            prize: 1,
            text: '5등'
        },
        {
            id: 6,
            desc: "감자칩",
            prize: 1,
            text: '6등'
        },
    ]);

    // handle input change
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [dataForWheel, setDataForWheel] = useState([
        '1등', '2등', '3등', '4등', '5등', '6등'
    ]);
    const [prizes, setPrizes] = useState([0, 4, 9, 18, 45, 85]);

    useEffect(() => {
        console.log(prizes);
    }, [prizes]);

    function customRandom(prizes) {
        // filter out indices with prize > 0
        const validIndices = prizes.reduce((acc, value, index) => {
            if (value > 0) {
                acc.push(index);
            }
            return acc;
        }, []);

        const probabilities = validIndices.map(index => [0, 0.02, 0.05, 0.1, 0.27, 0.63][index]);
        console.log(probabilities)
        const randomNumber = Math.random();
        let cumulativeProbability = 0;

        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomNumber <= cumulativeProbability) {
                return validIndices[i];
            }
        }
    }

    const handleSpinClick = () => {
        const newPrizeNumber = customRandom(prizes);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);

        setTimeout(() => {
            Swal.fire({
                title: "룰렛 결과",
                text: `선택된 항목: ${dataForWheel[newPrizeNumber]}`,
                icon: "success",
                confirmButtonText: "확인",
            });
            const updatedPrizes = [...prizes];
            updatedPrizes[newPrizeNumber] -= 1;
            setPrizes(updatedPrizes);
        }, 2500);
    };

    return (
        <div className="main-form">
            <Container>
                <div className="text-title">
                    <Title><Subtitle>에드짱과</Subtitle> 함께하는 뽑기게임</Title>
                </div>
                <>
                    <div align="center" className="roulette-container">
                        <Wheel
                            mustStartSpinning={mustSpin}
                            spinDuration={0.2}
                            prizeNumber={prizeNumber}
                            data={dataForWheel}
                            outerBorderColor="#D7F1FA"
                            outerBorderWidth={9}
                            innerBorderColor="#D7F1FA"
                            radiusLineColor="transparent"
                            radiusLineWidth={1}
                            textColors="#D7F1FA"
                            textDistance={55}
                            fontSize={20}
                            backgroundColors={[
                                "#253746",
                                "#425563",
                                "#768692",
                                "#98A4AE",
                                "#00A9CE",
                                "#131E29",
                            ]}
                            onStopSpinning={() => {
                                setMustSpin(false);
                            }}
                        />
                        <button className="button roulette-button" onClick={handleSpinClick}>
                            <img src={Logo} alt="Logo" width={60} height={60}/>
                        </button>
                    </div>
                </>
            </Container>
            <Prize>
                <PrizeBox>
                    {inputList.map((item) => (
                        <PrizeContainer key={item.id} left={prizes[item.id - 1]}>
                            {`${item.text} ${item.desc}: 잔여 ${prizes[item.id - 1]}`}
                        </PrizeContainer>
                    ))}
                </PrizeBox>
            </Prize>
        </div>
    );
};

const PrizeContainer = styled.div`
  width: 500px;
  height: 85px;
  background-color: ${props => props.left !== 0 ? "#D0D4D8" : "#253746"};
  border-radius: 24px;
  display: flex;
  align-items: center;
  padding-left: 40px;
  font-size: 21px;
`;

const PrizeBox = styled.div`
  width: 500px;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Empty = styled.div`
  display: none;
`;

const Prize = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 600;
  color: #253746;
  margin-bottom: 60px;
  margin-top: 40px;
`;

const Subtitle = styled.text`
  font-size: 40px;
  font-weight: 600;
  color: #00A9CE;
`;

export default Roulette;
