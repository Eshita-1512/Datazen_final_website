import { useBrainScene } from "../hooks/useBrainScene";

export default function Hero() {
  const { sceneRef, stageRef, canvasRef, flyTitleRef, txt1Ref, txt2Ref, txt3Ref, txt4Ref, hintRef } = useBrainScene();

  return (
    <>
      <div className="scene" id="home" ref={sceneRef}>
        <div className="stage" ref={stageRef}>
          <canvas id="brainCanvas" ref={canvasRef}></canvas>

          <div className="stext stext-left" id="txt1" ref={txt1Ref}>
            <span className="eyebrow">About Us</span>
            <h2>Pioneering <span className="red">Data Science</span> at Somaiya</h2>
            <p>DataZen sits at the intersection of innovation and education — empowering students to explore and master the world of data through collaboration and hands-on learning.</p>
          </div>

          <div className="stext stext-right" id="txt2" ref={txt2Ref}>
            <span className="eyebrow">Our Vision</span>
            <h2>A Vibrant <span className="red">Community</span></h2>
            <p>Fostering innovation and excellence in the field of data science through collaboration and hands-on learning.</p>
          </div>

          <div className="stext stext-left" id="txt3" ref={txt3Ref}>
            <span className="eyebrow">University Affiliation</span>
            <h2>Proudly <span className="red">Somaiya</span></h2>
            <p>DataZen is proudly affiliated with Somaiya Vidyavihar University, upholding its tradition of academic excellence and innovation.</p>
          </div>

          <div className="stext stext-right" id="txt4" ref={txt4Ref}>
            <span className="eyebrow">Our Community</span>
            <h2>Diverse &amp; <span className="red">Driven</span></h2>
            <p>A diverse network of students, faculty, and industry experts collaborating to advance data science knowledge and real-world applications.</p>
          </div>          <div className="scenehint" id="sceneHint" ref={hintRef}>scroll<span className="m"></span></div>
        </div>
      </div>
      <div className="flytitle" id="flyTitle" ref={flyTitleRef}>Data<span>Zen</span></div>
    </>
  );
}

