import "./lottery-widget-loader.scss";

export function LotteryWidgetLoader() {
  return (
    <div className="lottery-widget-loader" role="status" aria-label="Загрузка сцены">
      <div className="lottery-widget-loader__stage" aria-hidden="true">
        <div className="lottery-widget-loader__safe">
          <span className="lottery-widget-loader__door" />
          <span className="lottery-widget-loader__wheel" />
        </div>
      </div>

      <div className="lottery-widget-loader__code-panel" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span className="lottery-widget-loader__code-slot" key={index} />
        ))}
      </div>
    </div>
  );
}
