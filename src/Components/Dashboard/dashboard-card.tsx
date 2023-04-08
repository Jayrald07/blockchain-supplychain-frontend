import "./dashboard-card.css";

type Button = {
  label1: string;
  label2: string | number;
  icon?: React.ReactNode;
};

export default ({ label1, label2, icon }: Button) => {
  return (
    <div className="grid grid-cols-4 bg-slate-100 border text-slate-700">
      <div className=" text-center text-4xl p-3 flex items-center justify-center border-r bg-slate-200 text-slate-600">{icon}</div>
      <div className="col-span-3 text-right p-5">
        <div className="text-xs font-light">
          <label>{label1}</label>
        </div>
        <div className="text-2xl">
          <label>{label2}</label>
        </div>
      </div>
    </div>
  );
};
