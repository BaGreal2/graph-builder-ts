import styles from './Modal.module.css';
import { CrossIcon } from '../../assets/icons';

interface ModalProps {
	text: string;
	onModalClose: () => void;
	confirmText?: string;
	onConfirm?: () => void;
}

export default function Modal({
	text,
	onModalClose,
	confirmText,
	onConfirm,
}: ModalProps) {
	return (
		<div className={styles.modalContainer}>
			<span className={styles.textSpan}>{text}</span>
			{onConfirm && (
				<button
					className={styles.confirmButton}
					type="button"
					onClick={() => onConfirm()}
				>
					{confirmText}
				</button>
			)}
			<button
				className={styles.closeButton}
				type="button"
				onClick={() => onModalClose()}
			>
				<CrossIcon />
			</button>
		</div>
	);
}
