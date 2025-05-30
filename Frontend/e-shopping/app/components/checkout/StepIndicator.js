import styles from "../../styles/styles.module.css";
const StepIndicator = ({ currentStep }) => {
        const steps = [
        { label: "Adresse", step: 1 },
        { label: "Livraison", step: 2 },
        { label: "Paiement", step: 3 },
        ];
    
        return (
        <div className={styles.steps}>
            {steps.map((step, index) => (
            <div key={step.step} className="d-flex align-items-center">
                <div
                className={`rounded-circle text-center ${
                    step.step === currentStep ? "bg-dark text-white" : "bg-light text-muted"
                }`}
                style={{ width: "30px", height: "30px", lineHeight: "30px" }}
                >
                {step.step}
                </div>
                <span className="mx-2">{step.label}</span>
                {index < steps.length - 1 && (
                <div className="flex-grow-1 mx-2" style={{ borderBottom: "1px dashed #ccc" }}></div>
                )}
            </div>
            ))}
        </div>
        );
    };

    export default StepIndicator;