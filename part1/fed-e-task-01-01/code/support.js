class Container {
    static of(value) {
        return new Container(value)
    }

    constructor(value) {
        this._value = value
    }

    map(f) {
        return Container.of(f(this._value))
    }
}

class Maybe {
    static of(value) {
        return new Maybe(value)
    }

    constructor(value) {
        this._value = value
    }

    map(f) {
        return this.isNothing() ? Maybe.of(this._value) : Maybe.of(f(this._value))
    }

    isNothing() {
        return this._value === null || this._value === undefined
    }
}

module.exports = {
    Container,
    Maybe
}
