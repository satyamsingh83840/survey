"use client";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState(
    "वास्तविक OTP सत्यापन के लिए अपना मोबाइल नंबर दर्ज करें।",
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [petitionId, setPetitionId] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch("/api/petitions/count")
      .then((r) => r.json())
      .then((x) => setCount(x.count || 0))
      .catch(() => {});
  }, []);
  async function sendOtp() {
    setMessage("");
    if (!/^\+?[1-9]\d{9,14}$/.test(mobile)) {
      setMessage(
        "मोबाइल नंबर international format में दर्ज करें, जैसे +919876543210।",
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error || "OTP भेजा नहीं जा सका");
      setOtpSent(true);
      setStatus("OTP भेज दिया गया है।");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "OTP error");
    } finally {
      setBusy(false);
    }
  }
  async function verifyOtp() {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, code: otp }),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error || "OTP सत्यापन विफल");
      setOtpVerified(true);
      setVerificationToken(x.verificationToken);
      setStatus("✓ मोबाइल नंबर सत्यापित हो गया।");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "OTP verification error");
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    if (!otpVerified) {
      setMessage("पहले मोबाइल OTP सत्यापन करें।");
      return;
    }
    setBusy(true);
    const form = new FormData(e.currentTarget);
    form.set("mobile", mobile);
    form.set("verificationToken", verificationToken);
    try {
      const r = await fetch("/api/petitions", { method: "POST", body: form });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error || "Submission failed");
      setPetitionId(x.petitionId);
      setCount((c) => c + 1);
      e.currentTarget.reset();
      setOtpSent(false);
      setOtpVerified(false);
      setVerificationToken("");
      setOtp("");
      setStatus("वास्तविक OTP सत्यापन के लिए अपना मोबाइल नंबर दर्ज करें।");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="root">
      <header>
        <div className="wrap">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <img
              src="/logo.jpg"
              alt="भारतीय भाषा आंदोलन का लोगो"
              style={{ width: "min(180px,42vw)", borderRadius: "50%" }}
            />
          </div>
          <div className="eyebrow">जन-प्रतिनिधित्व • डिजिटल समर्थन</div>
          <div className="brand">जनता को न्याय</div>
          <div className="tag">जनता की भाषा में</div>
          <div className="sub">
            न्यायिक प्रक्रिया और न्याय से संबंधित महत्वपूर्ण जानकारी को आम
            नागरिक के लिए उसकी समझ की भाषा में अधिक सुलभ बनाने के संबंध में
            जन-समर्थन दर्ज करने हेतु डिजिटल प्रपत्र।
          </div>
        </div>
      </header>
      <main>
        <div className="wrap grid">
          <section className="card">
            <h2>प्रस्ताव का संक्षिप्त विवरण</h2>
            <p className="lead">
              इस जन-प्रतिनिधित्व का उद्देश्य यह आग्रह दर्ज करना है कि नागरिकों
              को न्यायिक प्रक्रिया, आदेशों और उनके कानूनी प्रभाव को समझने योग्य
              भाषा में जानकारी उपलब्ध कराने तथा संवैधानिक और वैधानिक व्यवस्था के
              अंतर्गत भारतीय भाषाओं में न्याय तक पहुँच को मजबूत करने के लिए
              आवश्यक कदमों पर विचार किया जाए।
            </p>
            <div className="points">
              <div className="point">
                <span className="num">01</span>
                <span>
                  न्यायिक प्रक्रिया की जानकारी नागरिकों के लिए अधिक समझने योग्य
                  बनाई जाए।
                </span>
              </div>
              <div className="point">
                <span className="num">02</span>
                <span>
                  महत्वपूर्ण निर्णयों और आदेशों के सरल हिंदी अनुवाद/सार की
                  उपलब्धता बढ़ाई जाए।
                </span>
              </div>
              <div className="point">
                <span className="num">03</span>
                <span>
                  जहाँ संविधान और कानून अनुमति देते हैं, वहाँ हिंदी तथा अन्य
                  भारतीय भाषाओं के प्रयोग को सुदृढ़ करने पर विचार किया जाए।
                </span>
              </div>
            </div>
            <div className="divider" />
            <div className="counter">
              <div>
                <div className="small">सत्यापित डिजिटल समर्थन</div>
                <div className="big">{count.toLocaleString("en-IN")}</div>
              </div>
              <span className="pill">Live</span>
            </div>
          </section>
          <section className="card">
            <h2>अपना समर्थन दर्ज करें</h2>
            <div className={`status ${otpVerified ? "verified" : ""}`}>
              {status}
            </div>
            <form onSubmit={submit}>
              <div>
                <label>
                  पूरा नाम <span className="required">*</span>
                </label>
                <input
                  name="name"
                  required
                  maxLength={120}
                  placeholder="अपना पूरा नाम लिखें"
                />
              </div>
              <div>
                <label>
                  मोबाइल नंबर <span className="required">*</span>
                </label>
                <div className="otp">
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    inputMode="tel"
                    required
                    placeholder="+919876543210"
                  />
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={sendOtp}
                    disabled={busy || otpVerified}
                  >
                    OTP भेजें
                  </button>
                </div>
              </div>
              {otpSent && !otpVerified && (
                <div>
                  <label>OTP</label>
                  <div className="otp">
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6 अंकों का OTP"
                    />
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={verifyOtp}
                      disabled={busy || otp.length !== 6}
                    >
                      सत्यापित करें
                    </button>
                  </div>
                </div>
              )}
              <div className="row">
                <div>
                  <label>राज्य *</label>
                  <input
                    name="state"
                    required
                    maxLength={80}
                    placeholder="राज्य"
                  />
                </div>
                <div>
                  <label>जिला *</label>
                  <input
                    name="district"
                    required
                    maxLength={80}
                    placeholder="जिला"
                  />
                </div>
              </div>
              <div>
                <label>पूरा पता *</label>
                <textarea
                  name="address"
                  required
                  maxLength={500}
                  placeholder="घर/गली, क्षेत्र, शहर आदि"
                />
              </div>
              <div>
                <label>पासपोर्ट आकार का फोटो *</label>
                <input
                  className="file"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                />
                <div className="notice">
                  JPG/PNG/WebP, अधिकतम 5 MB. फोटो Cloudinary में सुरक्षित media
                  storage के लिए upload होगी।
                </div>
              </div>
              <div>
                <label>वैकल्पिक पहचान सत्यापन</label>
                <div className="row">
                  <select name="idType" defaultValue="">
                    <option value="">पहचान-पत्र चुनें</option>
                    <option>Voter ID</option>
                    <option>Driving Licence</option>
                    <option>Passport</option>
                    <option>अन्य</option>
                  </select>
                  <input
                    name="idLast4"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="अंतिम 4 अंक"
                  />
                </div>
                <div className="notice">
                  पूरी Aadhaar संख्या या Aadhaar की प्रति इस form में न लें।
                </div>
              </div>
              <label className="check">
                <input name="consent1" type="checkbox" required />
                <span>
                  मैंने प्रस्ताव को पढ़/समझ लिया है और अपनी स्वतंत्र इच्छा से
                  इसके समर्थन में अपना विवरण दर्ज कर रहा/रही हूँ। *
                </span>
              </label>
              <label className="check">
                <input name="consent2" type="checkbox" required />
                <span>
                  मैं सहमत हूँ कि मेरे दिए गए विवरण का उपयोग इस जन-प्रतिनिधित्व,
                  समर्थन की गणना और संबंधित प्राधिकारियों के समक्ष प्रस्तुत करने
                  के लिए किया जा सकता है। *
                </span>
              </label>
              <label className="check">
                <input name="consent3" type="checkbox" required />
                <span>
                  मैं प्रमाणित करता/करती हूँ कि मैंने इस अभियान में अपना समर्थन
                  केवल एक बार दर्ज किया है। *
                </span>
              </label>
              {message && <div className="error">{message}</div>}
              <button className="btn" disabled={busy} type="submit">
                {busy ? "प्रक्रिया चल रही है…" : "समर्थन दर्ज करें"}
              </button>
            </form>
            {petitionId && (
              <div className="result">
                <strong>आपका समर्थन सफलतापूर्वक दर्ज हुआ।</strong>
                <p>आपका Petition ID:</p>
                <div className="pid">{petitionId}</div>
                <p className="small">इस ID को सुरक्षित रखें।</p>
              </div>
            )}
          </section>
        </div>
        <div className="wrap card" style={{ marginTop: 22 }}>
          <h2>गोपनीयता एवं उपयोग सूचना</h2>
          <p className="lead">
            यह प्रपत्र जन-समर्थन दर्ज करने के लिए है। नाम, मोबाइल, पता और फोटो
            जैसे personal data को केवल घोषित उद्देश्य के लिए लिया जाना चाहिए।
            Live deployment में privacy notice, data retention अवधि, access
            controls और deletion/correction process स्पष्ट रखें।
          </p>
        </div>
      </main>
    </div>
  );
}
