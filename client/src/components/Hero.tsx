import { useBrainScene } from "../hooks/useBrainScene";

export default function Hero() {
  const { sceneRef, stageRef, canvasRef, flyTitleRef, txtARef, txtIRef, hintRef } = useBrainScene();

  return (
    <>
      <div className="scene" id="home" ref={sceneRef}>
        <div className="stage" ref={stageRef}>
          <canvas id="brainCanvas" ref={canvasRef}></canvas>

          <div className="stext stext-left" id="txtAbout" ref={txtARef}>
            <span className="eyebrow">About Us</span>
            <h2>Pioneering <span className="red">Data Science</span> at Somaiya</h2>
            <p>DataZen sits at the intersection of innovation and education — empowering students to explore and master the world of data through collaboration and hands-on learning.</p>
          </div>

          <div className="stext stext-right" id="txtImpact" ref={txtIRef}>
            <span className="eyebrow">By The Numbers</span>
            <h2>Our Growth &amp; Impact</h2>
            <p>A thriving community driving real change — <b>5+</b> workshops &amp; events and <b>1600+</b> students impacted across campus, and growing every year.</p>
          </div>

          <div className="scenehint" id="sceneHint" ref={hintRef}>scroll<span className="m"></span></div>
        </div>
      </div>
      <div className="flytitle" id="flyTitle" ref={flyTitleRef}>Data<span>Zen</span></div>
    </>
  );
}

