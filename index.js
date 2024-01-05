const starParser = (field, range) => {
    let result = ''
    if(field === '*'){
        for (let i = range[0]; i <= range[1]; i++) {
            result += ` ${i}`;
        }
    }
    return result.trim()
}

const rangeParser = (field, range) => {
    let result = '';
    const regex = /^[0-9]+-[0-9]+$/;
    if(regex.test(field)){
        const start = field.split('-')[0];
        const end = field.split('-')[1];

        if(!start || !end){
            throw new Error(`Invalid field format: ${start} and ${end}`)
        }

        if(start && (start < range[0] || start > end)){
            throw new Error(`Invalid Start Range format: ${start}`)
        }

        if(end && end > range[1]){
            throw new Error(`Invalid End Range format: ${end}`)
        }

        for (let i = start; i <= end; i++) {
            result += ` ${i}`;
        }
    }
    return result.trim()
}

const commaParser = (field, range) => {
    let result = ''
    const regex = /^[0-9]+,[0-9]+$/
    if(regex.test(field)){
        const data = field.split(',')
        for(let i = 0; i < data.length; i +=1){
            if(data[i] < range[0] || data[i] > range[1]){
                throw new Error(`Invalid range: ${data[i]}`)
            }
            result += ` ${data[i]}`
        }
    }
    return result.trim()
}

const incrementParser = (field, range) => {
    let result = ''
    const regex = /^\*|[0-9]+\/[0-9]+$/;
    if(regex.test(field)){
        const parts = field.split('/');
        let start = parts[0];
        let incr = parts[1];

        if(start === '*'){
            start = range[0]
        }

        if(start < range[0] || start > range[1]){
            throw new Error(`Check the input pattern: ${start}`)
        }

        for(let i = start; i < range[1]; i +=1){
            if(i % incr === 0){
                result += ` ${i}`
            }
        }
    }
    return result.trim();
}

const digitParser = (field, range) => {
    const regex = /^[0-9]+$/;
    if(regex.test(field)){
        return field;
    }
}

const parseField = (field, range) => {
    const res = starParser(field, range) || rangeParser(field, range) || commaParser(field, range) || incrementParser(field, range) || digitParser(field, range)
    if(!res){
        throw new Error(`Please check input field: ${field}`)
    }
    return res;
}

export const cronParser = (cronString) => {
    const cronFields = cronString.split(' ');

    if(cronFields.length !== 6){
        throw new Error("Invalid cron input")
    }

    const Ranges = {
        'minute': [0, 59],
        'hour': [0, 23],
        'dayOfMonth': [1, 31],
        'month': [1, 12],
        'dayOfWeek': [0, 6],
    }
  
    const minute = parseField(cronFields[0], Ranges.minute);
    const hour = parseField(cronFields[1], Ranges.hour);
    const dayOfMonth = parseField(cronFields[2], Ranges.dayOfMonth);
    const month = parseField(cronFields[3], Ranges.month);
    const dayOfWeek = parseField(cronFields[4], Ranges.dayOfWeek);
    const command = cronFields[5];
  
    return {
        minute,
        hour,
        dayOfMonth,
        month,
        dayOfWeek,
        command
    }
};

const main = () => {
    const cronString = process.argv[2];
    const res = cronParser(cronString);
    console.log(res.minute);
    console.log(res.hour);
    console.log(res.dayOfMonth);
    console.log(res.month);
    console.log(res.dayOfWeek);
    console.log(res.command);
}

const args = process.argv;

if(args && args.length === 3){
    main();
}



