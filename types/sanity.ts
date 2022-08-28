export interface SanityImageReference {
    _type: "image"
    asset: {
        _ref: string
        _type: "reference"
    }
}

export interface SanityColorTheme {
    background: {
        hex: string
    }
    text: {
        hex: string
    }
}