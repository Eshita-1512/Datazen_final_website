import { useBrainScene } from "../hooks/useBrainScene";

export default function Hero() {
  const { sceneRef, stageRef, canvasRef, flyTitleRef, txt1Ref, txt2Ref, txt3Ref, txt4Ref, hintRef } = useBrainScene();

  return (
    <>
      <div className="scene" id="home" ref={sceneRef}>
        <div className="stage" ref={stageRef}>
          <canvas id="brainCanvas" ref={canvasRef}></canvas>

          <div className="stext stext-left" id="txt1" ref={txt1Ref}>
            <span className="eyebrow">Data Science Council</span>
            <h2>Student <span className="red">Data Science</span> at Somaiya</h2>
            <p>We run campus hackathons, technical workshops, and open data projects for students across Somaiya Vidyavihar University.</p>
          </div>

          <div className="stext stext-right" id="txt2" ref={txt2Ref}>
            <span className="eyebrow">Practical Learning</span>
            <h2>Peer Sprints &amp; <span className="red">Workshops</span></h2>
            <p>Hands-on sessions covering machine learning, analytics, and data engineering tools led by experienced student mentors.</p>
          </div>

          <div className="stext stext-left" id="txt3" ref={txt3Ref}>
            <span className="eyebrow">Campus Affiliation</span>
            <h2>Somaiya <span className="red">Vidyavihar</span></h2>
            <p>An official student body supporting data science initiatives, research papers, and inter-collegiate technical competitions.</p>
          </div>

          <div className="stext stext-right" id="txt4" ref={txt4Ref}>
            <span className="eyebrow">Council Operations</span>
            <h2>Student <span className="red">Committees</span></h2>
            <p>Teams across Technical, Logistics, Design, Public Relations, and Sponsorship managing year-round data initiatives.</p>
          </div>
          <div className="scenehint" id="sceneHint" ref={hintRef}>scroll<span className="m"></span></div>
        </div>
      </div>
      <div className="flytitle tracking-wider font-bold uppercase" id="flyTitle" ref={flyTitleRef} style={{ fontFamily: "'Tektur', sans-serif" }}>DATA<span>ZEN</span></div>
    </>
  );
}

