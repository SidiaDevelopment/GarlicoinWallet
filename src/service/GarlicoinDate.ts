class GarlicoinDate {
    public static formattedDate(timestamp: number): string {
        let date: Date = new Date(timestamp * 1000);
        let dateString: string;

        dateString = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        dateString += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return dateString;
    }
}

export default GarlicoinDate;