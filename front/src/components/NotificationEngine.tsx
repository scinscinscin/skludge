import { useState } from "react";
import "./NotificationEngine.css";

interface Props {}

interface Notification {
	title: string;
	body?: string;
	duration?: number | false;
}

export type NotificationEngine = ReturnType<typeof NotificationEngine>;

export function NotificationEngine() {
	const [notifs, setNotifs] = useState<Notification[]>([]);

	function Element(props: Props) {
		return (
			<div className="notification_engine">
				<div className="notif_sidebar">
					{notifs.map((notif, idx) => (
						<div className="notif darker" key={idx}>
							<header>
								<h1>{notif.title}</h1>
							</header>
							<section>{notif.body != null && <p>{notif.body}</p>}</section>
						</div>
					))}
				</div>
			</div>
		);
	}

	function notify(notif: Notification) {
		setNotifs([...notifs, notif]);

		setTimeout(
			() => setNotifs(notifs.filter((n) => n != notif)),
			typeof notif.duration === "number" ? notif.duration : 8000
		);
	}

	return { Element, notify };
}
