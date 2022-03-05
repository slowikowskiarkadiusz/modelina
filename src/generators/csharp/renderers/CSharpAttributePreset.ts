import { PropertyType } from '../../../models';
import { pascalCase } from 'change-case';
import { CsharpClassPreset, CSharpPreset } from '../CSharpPreset';
import { CSHARP_DEFAULT_ENUM_PRESET } from './EnumRenderer';

export const CSHARP_ATTRIBUTE_CLASS_PRESET: CsharpClassPreset = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    async property({ renderer, propertyName, property, type }) {
        propertyName = pascalCase(renderer.nameProperty(propertyName, property));
        let propertyType = renderer.renderType(property);
        if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
            propertyType = `Dictionary<string, ${propertyType}>`;
        }

        let attribute: string = '';
        if (property.originalInput?.attribute) {
            const parameters = property.originalInput?.attribute.parameters?.map((x: { type: string, value: any }) => `"${x.value}"`)?.join(', ');
            attribute = `[${pascalCase(property.originalInput?.attribute.name)}(${parameters})]\n`
        }

        const getter = await renderer.runGetterPreset(propertyName, property, type);
        const setter = await renderer.runSetterPreset(propertyName, property, type);

        return `${attribute}public ${propertyType} ${propertyName} { ${getter} ${setter} }`;
    },
    accessor() { return '' },
    getter() { return `get;`; },
    setter() { return `set;`; }
};

export const CSHARP_ATTRIBUTE_PRESET: CSharpPreset = {
    class: CSHARP_ATTRIBUTE_CLASS_PRESET,
    enum: CSHARP_DEFAULT_ENUM_PRESET,
};
