type StatusCardProps = {
  status: string;
};

function StatusCard({ status }: StatusCardProps) {
  return <p>Backend Status: {status}</p>;
}

export default StatusCard;