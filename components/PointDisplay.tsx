import Controls from "./Controls";
import NumberDisplay from "./NumberDisplay";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const PointDisplay = () => {

  return (
    <Card className="w-full max-w-sm mt-4">
        <CardHeader>
            <CardTitle>String Art Points</CardTitle>
            <CardDescription>Slide to move points</CardDescription>
        </CardHeader>
        <CardContent>
        <NumberDisplay />
        </CardContent>
        <CardFooter>
        <Controls />
        </CardFooter>
    </Card>
  )
}

export default PointDisplay