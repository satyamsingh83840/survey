"use client";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
type Fields = {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  idType: string;
  idLast4: string;
  c1: boolean;
  c2: boolean;
  c3: boolean;
};
const initialForm: Fields = {
  name: "",
  phoneNumber: "",
  email: "",
  address: "",
  idType: "",
  idLast4: "",
  c1: false,
  c2: false,
  c3: false,
};
export default function Home() {
  const [form, setForm] = useState<Fields>(initialForm);
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [petitionId, setPetitionId] = useState("");
  async function loadCount() {
    try {
      const r = await fetch("/api/surveys", { cache: "no-store" });
      const d = await r.json();
      if (d.success) setCount(d.count);
    } catch {
      /* count may load later */
    }
  }
  useEffect(() => {
    void loadCount();
  }, []);
  function change(field: keyof Fields, value: string | boolean) {
    setForm((old) => ({ ...old, [field]: value }) as Fields);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setPetitionId("");
    try {
      const r = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok || !d.success) {
        setMessage("जानकारी सेव नहीं हो सकी। कृपया दोबारा कोशिश करें।");
        return;
      }
      setCount(d.count);
      setPetitionId(d.id);
      setMessage("आपका समर्थन सफलतापूर्वक दर्ज हुआ।");
      setForm(initialForm);
    } catch {
      setMessage("सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा कोशिश करें।");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="root">
      <header>
        <div className="wrap heroInner">
          <div className="logoWrap">
            <Image
              src="/campaign-logo.jpg"
              alt="भारतीय भाषा आंदोलन का लोगो"
              width={180}
              height={180}
              priority
            />
          </div>
          <div className="eyebrow">जन-प्रतिनिधित्व • डिजिटल समर्थन</div>
          <h1 className="brand">जनता को न्याय</h1>
          <div className="tag">जनता की भाषा में</div>
          <p className="sub">
            न्यायिक प्रक्रिया और न्याय से संबंधित महत्वपूर्ण जानकारी को आम
            नागरिक के लिए उसकी समझ की भाषा में अधिक सुलभ बनाने के संबंध में
            जन-समर्थन दर्ज करने हेतु डिजिटल प्रपत्र।
          </p>
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
                <div className="small">कुल दर्ज समर्थन</div>
                <div className="big">
                  {count === null ? "—" : count.toLocaleString("en-IN")}
                </div>
              </div>
              <span className="pill">Live Count</span>
            </div>
            <p className="footer"> सभी submissions की कुल संख्या है </p>
          </section>
          <section className="card">
            <h2>अपना समर्थन दर्ज करें</h2>
            <p className="lead">
              कृपया नीचे अपना विवरण दर्ज करें। OTP या अन्य फॉर्म सत्यापन नहीं
              है।
            </p>
            <form onSubmit={submit} noValidate>
              <div>
                <label htmlFor="name">पूरा नाम</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  placeholder="अपना पूरा नाम लिखें"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber">मोबाइल नंबर</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => change("phoneNumber", e.target.value)}
                  placeholder="मोबाइल नंबर"
                />
              </div>
              <div>
                <label htmlFor="email">ईमेल</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => change("email", e.target.value)}
                  placeholder="ईमेल पता"
                />
              </div>
              <div>
                <label htmlFor="address">पूरा पता</label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={(e) => change("address", e.target.value)}
                  placeholder="घर/गली, क्षेत्र, शहर आदि"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="idType">पहचान-पत्र का प्रकार (वैकल्पिक)</label>
                <select
                  id="idType"
                  name="idType"
                  value={form.idType}
                  onChange={(e) => change("idType", e.target.value)}
                >
                  <option value="">पहचान-पत्र चुनें</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driving Licence">Driving Licence</option>
                  <option value="Passport">Passport</option>
                  <option value="Other">अन्य</option>
                </select>
              </div>
              <div>
                <label htmlFor="idLast4">
                  पहचान-पत्र के अंतिम 4 अंक (वैकल्पिक)
                </label>
                <input
                  id="idLast4"
                  name="idLast4"
                  value={form.idLast4}
                  onChange={(e) => change("idLast4", e.target.value)}
                  placeholder="अंतिम 4 अंक (यदि देना चाहें)"
                />
              </div>
              <div className="consents">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.c1}
                    onChange={(e) => change("c1", e.target.checked)}
                  />
                  <span>
                    मैंने प्रस्ताव को पढ़/समझ लिया है और अपनी स्वतंत्र इच्छा से
                    इसके समर्थन में अपना विवरण दर्ज कर रहा/रही हूँ।
                  </span>
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.c2}
                    onChange={(e) => change("c2", e.target.checked)}
                  />
                  <span>
                    मैं सहमत हूँ कि मेरे दिए गए विवरण का उपयोग इस
                    जन-प्रतिनिधित्व, समर्थन की गणना और संबंधित प्राधिकारियों के
                    समक्ष प्रस्तुत करने के लिए किया जा सकता है।
                  </span>
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.c3}
                    onChange={(e) => change("c3", e.target.checked)}
                  />
                  <span>
                    मैं प्रमाणित करता/करती हूँ कि मैंने इस अभियान में अपना
                    समर्थन केवल एक बार दर्ज किया है।
                  </span>
                </label>
              </div>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "सेव हो रहा है…" : "समर्थन दर्ज करें"}
              </button>
            </form>
            {message && (
              <div
                className={petitionId ? "result success" : "result"}
                role="status"
              >
                <strong>{message}</strong>
                {petitionId && <p className="pid">Petition ID: {petitionId}</p>}
              </div>
            )}
          </section>
        </div>
        <div className="wrap card privacy">
          <h2>गोपनीयता एवं उपयोग सूचना</h2>
          <p className="lead">
            आपके द्वारा दी गई जानकारी इस जन-समर्थन को दर्ज करने और कुल संख्या
            दिखाने के लिए MongoDB में सेव की जाती है। केवल आवश्यक विवरण साझा
            करें। Live deployment से पहले privacy notice, data retention अवधि और
            access controls तय करें।
          </p>
        </div>
      </main>
    </div>
  );
}
