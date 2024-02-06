import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import ArrowButton from "./components/ArrowButton";
import { RotateCcw, Play, Pause } from "lucide-react";
import { updateXY, changeXMove, changeYMove, newBall } from "./features/ball";

function App() {
  const ballStore = useSelector((store) => store.ballSliceReducer);
  const dispatch = useDispatch();
  //console.log(ballStore);
  // Gestion du plateau ------------------------------------------------
  const setWidth = () => {
    if (innerWidth < 800 && innerHeight < (innerWidth * 3) / 5) {
      return (innerHeight * 5) / 3;
    } else {
      return Math.min(innerWidth, 800);
    }
  };
  const [playGroundWidth, setPlayGroundWidth] = useState(setWidth());
  onresize = (e) => {
    console.log("resize !", e);
    setPlayGroundWidth(setWidth());
    dispatch(newBall(playGroundWidth));
  };
  //console.log(innerWidth);
  const playGroundHeight = Math.floor((playGroundWidth * 3) / 5);
  //console.log("playGroundHeight", playGroundHeight);
  const buttonWidth = Math.floor(playGroundWidth / 15);
  //console.log("buttonWidth", buttonWidth);

  //Gestion des raquettes --------------------------------------
  const paddleHeight = Math.floor(playGroundHeight / 5);
  const paddleWidth = 8;
  const paddleMove = playGroundHeight / 5;
  //console.log("paddleHeight", paddleHeight);
  const initialPaddlePosition = Math.floor(
    (playGroundHeight - paddleHeight) / 2
  );
  const [leftPaddleYPosition, setLeftPaddleYPosition] = useState(
    initialPaddlePosition
  );
  const [rightPaddleYPosition, setRightPaddleYPosition] = useState(
    initialPaddlePosition
  );

  /**
   *
   * @param {boolean} up
   * @param {boolean} left
   */
  const movePaddle = (up, left) => {
    if (up && left) {
      const newY = leftPaddleYPosition - paddleMove;
      setLeftPaddleYPosition(newY < 0 ? 0 : newY);
    }
    if (up && !left) {
      const newY = rightPaddleYPosition - paddleMove;
      setRightPaddleYPosition(newY < 0 ? 0 : newY);
    }
    if (!up && left) {
      const newY = leftPaddleYPosition + paddleMove;
      const maxHeight = playGroundHeight - paddleHeight;
      setLeftPaddleYPosition(newY > maxHeight ? maxHeight : newY);
    }
    if (!up && !left) {
      const newY = rightPaddleYPosition + paddleMove;
      const maxHeight = playGroundHeight - paddleHeight;
      setRightPaddleYPosition(newY > maxHeight ? maxHeight : newY);
    }
  };

  // Gestion du jeu
  const [playGame, setPlayGame] = useState(false);
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);
  const handleReset = () => {
    setPlayGame(false);
    setScoreLeft(0);
    setScoreRight(0);
    dispatch(newBall(playGroundWidth));
    setLeftPaddleYPosition(initialPaddlePosition);
    setRightPaddleYPosition(initialPaddlePosition);
  };
  const handlePlay = () => {
    console.log("click !", !playGame);
    setPlayGame(!playGame);
  };
  // Gestion de la balle -------------------------------------

  const gameBorders = {
    northBorder: 0,
    eastBorder: Math.floor(
      playGroundWidth - buttonWidth - paddleWidth - ballStore.diameter
    ),
    southBorder: Math.floor(playGroundHeight - ballStore.diameter),
    westBorder: Math.floor(buttonWidth + paddleWidth),
  };
  //console.log("gameBorders", gameBorders);

  const moveBall = () => {
    dispatch(
      updateXY({
        newX: ballStore.xPosition + ballStore.xMove,
        newY: ballStore.yPosition + ballStore.yMove,
      })
    );
  };
  let ballInterval = undefined;
  if (playGame) {
    if (
      ballStore.xPosition > gameBorders.eastBorder &&
      rightPaddleYPosition > ballStore.yPosition + ballStore.diameter
    ) {
      console.log("Right - Up");
      setPlayGame(false);
      setScoreLeft(scoreLeft + 1);
      dispatch(newBall(playGroundWidth));
    } else if (
      ballStore.xPosition > gameBorders.eastBorder &&
      rightPaddleYPosition + paddleHeight <
        ballStore.yPosition + ballStore.diameter / 2
    ) {
      console.log("Right - Down");
      setPlayGame(false);
      setScoreLeft(scoreLeft + 1);
      dispatch(newBall(playGroundWidth));
    } else if (
      ballStore.xPosition < gameBorders.westBorder &&
      leftPaddleYPosition + paddleHeight <
        ballStore.yPosition + ballStore.diameter / 2
    ) {
      console.log("Left - Down");
      setPlayGame(false);
      setScoreRight(scoreRight + 1);
      dispatch(newBall(playGroundWidth));
    } else if (
      ballStore.xPosition < gameBorders.westBorder &&
      leftPaddleYPosition > ballStore.yPosition + ballStore.diameter
    ) {
      console.log("Left - Up");
      setPlayGame(false);
      setScoreRight(scoreRight + 1);
      dispatch(newBall(playGroundWidth));
    } else if (ballStore.xPosition > gameBorders.eastBorder) {
      dispatch(changeXMove("toLeft"));
    } else if (ballStore.xPosition < gameBorders.westBorder) {
      dispatch(changeXMove("toRight"));
    } else if (ballStore.yPosition > gameBorders.southBorder) {
      dispatch(changeYMove("Up"));
    } else if (ballStore.yPosition < gameBorders.northBorder) {
      dispatch(changeYMove("Down"));
    } else {
      ballInterval = setTimeout(moveBall, 15);
      console.log("ballInterval => mount :", ballInterval);
    }
  }

  return (
    <>
      <div
        id="playground"
        className="relative mx-auto  flex justify-between "
        style={{
          width: `${playGroundWidth.toString()}px`,
          height: `${playGroundHeight.toString()}px`,
        }}
      >
        <div className="flex flex-col h-full bg-slate-800">
          <ArrowButton
            up={true}
            left={true}
            buttonWidth={buttonWidth}
            handleClick={movePaddle}
          />
          <ArrowButton
            up={false}
            left={true}
            buttonWidth={buttonWidth}
            handleClick={movePaddle}
          />
        </div>
        <div
          id="left-paddle"
          className={`absolute  w-[8px] bg-red-950 border-2 border-[orangered] rounded`}
          style={{
            top: `${leftPaddleYPosition}px`,
            left: `${buttonWidth}px`,
            height: `${paddleHeight}px`,
          }}
        ></div>
        <div className="grow bg-blue-500 flex justify-center items-center">
          <div className="w-full flex justify-evenly items-center">
            <p
              className="text-8xl text-white"
              style={{ fontFamily: "Orbitron" }}
            >
              {scoreLeft}
            </p>
            <p
              className="text-8xl  text-white"
              style={{ fontFamily: "Orbitron" }}
            >
              {scoreRight}
            </p>
          </div>
        </div>
        <div
          id="right-paddle"
          className={`absolute  w-[8px] bg-red-950 border-2 border-[orangered] rounded`}
          style={{
            top: `${rightPaddleYPosition}px`,
            right: `${buttonWidth}px`,
            height: `${paddleHeight}px`,
          }}
        ></div>
        <div className="flex flex-col h-full bg-slate-800">
          <ArrowButton
            up={true}
            left={false}
            buttonWidth={buttonWidth}
            handleClick={movePaddle}
          />
          <ArrowButton
            up={false}
            left={false}
            buttonWidth={buttonWidth}
            handleClick={movePaddle}
          />
        </div>

        <div
          id="ball"
          className="absolute h-4 w-4 z-20 rounded-full bg-slate-50 bottom-[50%] left-20 border border-slate-950"
          style={{
            left: `${ballStore.xPosition}px`,
            top: `${ballStore.yPosition}px`,
          }}
        ></div>
        <div className="absolute top-[10%] w-full flex justify-around">
          <div
            id="play"
            onClick={handlePlay}
            className="flex justify-center items-center h-8 w-8 rounded-full bg-lime-600  border border-slate-100 sm:h-12 sm:w-12 sm:1/4"
          >
            {playGame ? <Pause color="white" /> : <Play color="white" />}
          </div>
          <div
            id="reset"
            onClick={handleReset}
            className="flex justify-center items-center  h-8 w-8 rounded-full bg-[orangered]  border border-slate-100 sm:h-12 sm:w-12 "
          >
            <RotateCcw color="white" />
          </div>
        </div>
        <div
          id="title"
          className="z-0 flex justify-center items-center absolute h-8 w-12 rounded-full bg-[orangered] bottom-4 left-1/2 -translate-x-1/2 border border-slate-100 sm:h-12 sm:w-16 sm:bottom-10"
        >
          <span className="text-2xl" style={{ fontFamily: "Honk" }}>
            PongByLezardon
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
