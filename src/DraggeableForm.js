import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BiTrash, BiGridVertical, BiPlus } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import Swal from "sweetalert2";
import {Wheel} from "react-custom-roulette";
import Logo from "./edcanlogo.svg";
import EdcanChan from "./edcanchan.svg";

const Roulette = () => {
    const [inputList, setInputList] = useState([
        {
            id: uuidv4(),
            text: "1등",
            desc: "G102 마우스",
        },
        {
            id: uuidv4(),
            text: "2등",
            desc: "소형 아크릴 스탠드",
        },
        {
            id: uuidv4(),
            text: "3등",
            desc: "키링",
        },
        {
            id: uuidv4(),
            text: "4등",
            desc: "안경닦이 or 마우스패드",
        },
        {
            id: uuidv4(),
            text: "5등",
            desc: "약과"
        },
        {
            id: uuidv4(),
            text: "6등",
            desc: "감자칩"
        },
    ]);

    // handle input change
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [rouletteData, setRouletteData] = useState(inputList);
    const [prize,setPrize] = useState([1,5,10,20,50,100]);

    function customRandom(prize) {
        // filter out indices with prize > 0
        const validIndices = prize.reduce((acc, value, index) => {
            if (value > 0) {
                acc.push(index);
            }
            return acc;
        }, []);

        if (validIndices.length === 0) {
            // All prizes are 0, return a default index (e.g., 0)
            handleRemoveClick();
            return 0;
        }

        const probabilities = validIndices.map(index => [0.005, 0.02, 0.05, 0.1, 0.2, 0.625][index]);
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
        const newPrizeNumber = customRandom(prize);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);

        setTimeout(() => {
            Swal.fire({
                title: "룰렛 결과",
                text: `선택된 항목: ${rouletteData[newPrizeNumber].option}`,
                icon: "success",
                confirmButtonText: "확인",
            });
            const updatedPrize = [...prize];
            updatedPrize[newPrizeNumber] -= 1;
            setPrize(updatedPrize);
        }, 2500);
    };

    useEffect(() => {
        // Check if prize[i] is 0 for each index i
        const hasZeroPrize = prize.some(prizeValue => prizeValue === 0);

        if (hasZeroPrize) {
            handleRemoveClick(); // Call handleRemoveClick if prize[i] is 0
        }
    }, [prize]);


    useEffect(() => {
        const addShortString = inputList.map((item) => {
            return {
                completeOption: item.text,
                option:
                    item.text.length >= 30
                        ? item.text.substring(0, 30).trimEnd() + "..."
                        : item.text,
            };
        });
        setRouletteData(addShortString);
    }, [inputList]);
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const rouletteResult = customRandom(prize);
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { text: "", id: uuidv4() }]);
    };

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(inputList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setInputList(items);
    }

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
                            spinDuration={[0.2]}
                            prizeNumber={prizeNumber}
                            data={rouletteData}
                            outerBorderColor={["#D7F1FA"]}
                            outerBorderWidth={[9]}
                            innerBorderColor={["#D7F1FA"]}
                            radiusLineColor={["tranparent"]}
                            radiusLineWidth={[1]}
                            textColors={["#D7F1FA"]}
                            textDistance={55}
                            fontSize={[20]}
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
                <Empty>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="items">
                            {(provided) => (
                                <ul
                                    className="items"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ listStyle: "none" }}
                                >
                                    {inputList.map((x, index) => {
                                        return (
                                            <Draggable key={x.id} draggableId={x.id} index={index}>
                                                {(provided) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="list-item"
                                                    >
                                                        <div className="item">
                                                            <BiGridVertical />
                                                            <input
                                                                name="text"
                                                                placeholder=""
                                                                value={x.text}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                className="input"
                                                            />
                                                            <div className="btn-box">
                                                                {inputList.length !== 1 && (
                                                                    <button
                                                                        className="button"
                                                                        onClick={() => handleRemoveClick(index)}
                                                                    >
                                                                        <BiTrash />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <button
                        onClick={handleAddClick}
                        style={{ marginLeft: "2.1rem" }}
                        className="button"
                    >
                        <BiPlus />
                    </button>
                </Empty>
            </Container>
            <Prize>
                <PrizeBox>
                    {
                        inputList.map((item, index)=>(
                        <PrizeContainer left={prize[index]}>
                            {item.text}&nbsp;{item.desc}: 잔여 {prize[index]}개
                        </PrizeContainer>
                    ))
                    }
                </PrizeBox>
            </Prize>
        </div>
    );
};

const Chan = styled.image`
  display: flex;
  width: 100px;
  height: 100px;
`;

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
